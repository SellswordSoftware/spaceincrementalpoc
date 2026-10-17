import { object, dictionary, array, integer, nonnegative, text, id, choice, boolean, requireValid } from './schema.js';
import { getBalanceHash } from './serialization.js';
import { SAVE_SCHEMA_VERSION, SIMULATION_VERSION } from './versions.js';
import { populationSummary } from './people.js';

const target = choice(['moon','jupiter','saturn','star-clusters','nebulae','galaxies','galaxy-clusters','radio-sources','transit-targets','infrared-fields','deep-field']);
const stocks = object({D:nonnegative,F:nonnegative,K:nonnegative,I:nonnegative,X:nonnegative,E:nonnegative,C:nonnegative});
const state = object({clock:object({tick:integer,campaignIndex:integer}),resources:stocks,insight:object({points:integer,totalEarned:integer,upgrades:dictionary(id,integer),phase:choice(['playing','shop']),lastAward:integer}),purchases:dictionary(id,integer),
  population:object({total:integer}),academy:object({timers:array(nonnegative),remainder:nonnegative}),
  science:object({publications:integer,timers:array(nonnegative),remainder:nonnegative}),
  missions:dictionary(id,object({progress:nonnegative,cycles:integer,remainder:nonnegative})),
  joint:object({programs:dictionary(id,object({progress:nonnegative,cycles:integer,remainder:nonnegative,publicationRemainder:nonnegative})),finaleProgress:(value,path)=>{if(value!==null)nonnegative(value,path);},completedAtTick:(value,path)=>{if(value!==null)integer(value,path);}}),
  journal:array(target),nextActionTick:integer,modified:boolean});
const envelope = object({schemaVersion:integer,contentVersion:text,balanceId:text,balanceHash:text,simulationVersion:text,state});

/** @param {unknown} value @param {import('./types.js').Definitions} definitions @param {import('./types.js').Balance} balance
 * @returns {asserts value is import('./types.js').GameState}
 */
export function validateGame(value, definitions, balance) {
  envelope(value,'save');
  const game = /** @type {import('./types.js').GameState} */ (value);
  requireValid(game.schemaVersion === SAVE_SCHEMA_VERSION,'save','This save uses a previous economy. Export it and start a new station prototype.');
  requireValid(game.contentVersion === definitions.contentVersion && game.simulationVersion === SIMULATION_VERSION,'save','incompatible content or simulation version');
  requireValid(game.balanceId === balance.id && game.balanceHash === getBalanceHash(balance,definitions),'save','configuration mismatch');
  let insightSpent=0;
  for (const [key,count] of Object.entries(game.state.insight.upgrades)) {
    const upgrade=definitions.insightUpgrades.find(item=>item.id===key);
    requireValid(upgrade && count<=upgrade.maxLevel,'insight',`unknown or excessive upgrade ${key}`);
    for (let level=0;level<count;level++) insightSpent+=Math.ceil(upgrade.cost*upgrade.growth**level);
  }
  requireValid(game.state.insight.points+insightSpent===game.state.insight.totalEarned,'insight','earned points must match spent and available Insight');
  requireValid(game.state.insight.lastAward<=game.state.insight.totalEarned,'insight','last award exceeds total earned');
  requireValid(game.state.clock.campaignIndex>=1,'run','run number must be positive');
  if (game.state.insight.phase==='shop') {
    requireValid(Object.keys(game.state.purchases).length===0 && game.state.population.total===0 && game.state.academy.timers.length===0
      && game.state.science.publications===0 && game.state.science.timers.length===0 && Object.keys(game.state.joint.programs).length===0 && game.state.joint.finaleProgress===null && game.state.joint.completedAtTick===null && Object.keys(game.state.missions).length===0 && game.state.clock.tick===0
      && Object.entries(game.state.resources).every(([key,value])=>value===balance.startingStocks[/** @type {import('./types.js').StockId} */(key)]),
      'prestige','between-run state must have reset ordinary progress');
  }
  for (const [key,count] of Object.entries(game.state.purchases)) {
    const item = definitions.investments.find(item => item.id === key);
    requireValid(item && count <= item.maxLevel,'purchases',`unknown or excessive purchase ${key}`);
  }
  requireValid(populationSummary(game,definitions).available >= 0,'population','appointments exceed graduates');
  for (const kind of /** @type {const} */(['academy','science'])) {
    const station=game.state[kind];
    const unlock=kind==='academy'?'academy':'photometry';
    const appointment=kind==='academy'?'appoint-teacher':'appoint-scientist';
    const expected=game.state.purchases[unlock]?1+(game.state.purchases[appointment]??0):0;
    const duration=kind==='academy'?balance.course.seconds:definitions.programs[0].work;
    requireValid(station.timers.length===expected && station.timers.every(time=>time<duration),kind,'timer count or cycle progress mismatch');
    requireValid(station.remainder<1 && (expected>0 || station.remainder===0),kind,'invalid fractional reward');
  }
  for (const [id,mission] of Object.entries(game.state.missions)) {
    const definition=definitions.missions.find(item=>item.id===id);
    requireValid(definition && game.state.purchases[definition.commissionId] && mission.progress<definition.seconds && mission.remainder<1,'missions','invalid mission or cycle progress');
  }
  for (const mission of definitions.missions) requireValid(Boolean(game.state.missions[mission.id])===Boolean(game.state.purchases[mission.commissionId]),'missions','commissioned mission must have a timer');
  for (const [id,state] of Object.entries(game.state.joint.programs)) {
    const program=definitions.jointPrograms.find(item=>item.id===id);
    requireValid(program && game.state.purchases[program.investmentId] && state.progress<program.seconds && state.remainder<1 && state.publicationRemainder<1,'joint','invalid program cycle');
  }
  for (const program of definitions.jointPrograms) requireValid(Boolean(game.state.joint.programs[program.id])===Boolean(game.state.purchases[program.investmentId]),'joint','established program must have a timer');
  const joint=game.state.joint;
  requireValid(Boolean(game.state.purchases[definitions.finale.investmentId])===(joint.finaleProgress!==null),'finale','synthesis purchase and progress must agree');
  requireValid(joint.finaleProgress===null || joint.finaleProgress<=definitions.finale.seconds,'finale','invalid synthesis progress');
  requireValid((joint.completedAtTick!==null)===(joint.finaleProgress===definitions.finale.seconds),'finale','completion must agree with finished progress');
  requireValid(joint.completedAtTick===null || joint.completedAtTick<=game.state.clock.tick,'finale','completion is in the future');
  requireValid((game.state.purchases['observing-grant']??0)<=game.state.science.publications,'grants','grants exceed Publications');
}
