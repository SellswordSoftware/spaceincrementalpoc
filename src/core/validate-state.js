import { object, dictionary, array, integer, nonnegative, text, id, choice, boolean, requireValid } from './schema.js';
import { getBalanceHash } from './serialization.js';
import { SAVE_SCHEMA_VERSION, SIMULATION_VERSION } from './versions.js';
import { populationSummary } from './people.js';

const target = choice(['moon','jupiter','saturn','star-clusters','nebulae']);
const stocks = object({D:nonnegative,F:nonnegative,K:nonnegative,I:nonnegative,X:nonnegative,E:nonnegative,C:nonnegative});
const state = object({clock:object({tick:integer,campaignIndex:integer}),resources:stocks,insight:object({points:integer,totalEarned:integer,upgrades:dictionary(id,integer),phase:choice(['playing','shop']),lastAward:integer}),purchases:dictionary(id,integer),
  population:object({total:integer}),course:(value,path) => { if (value !== null) object({progress:nonnegative})(value,path); },
  science:object({publications:integer,program:(value,path)=>{if(value!==null)object({id,progress:nonnegative})(value,path);}}),
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
    requireValid(Object.keys(game.state.purchases).length===0 && game.state.population.total===0 && game.state.course===null
      && game.state.science.publications===0 && game.state.science.program===null && game.state.clock.tick===0
      && Object.entries(game.state.resources).every(([key,value])=>value===balance.startingStocks[/** @type {import('./types.js').StockId} */(key)]),
      'prestige','between-run state must have reset ordinary progress');
  }
  for (const [key,count] of Object.entries(game.state.purchases)) {
    const item = definitions.investments.find(item => item.id === key);
    requireValid(item && count <= item.maxLevel,'purchases',`unknown or excessive purchase ${key}`);
  }
  requireValid(populationSummary(game,definitions).available >= 0,'population','appointments exceed graduates');
  const program=game.state.science.program;
  if (program) {
    const definition=definitions.programs.find(item=>item.id===program.id);
    requireValid(definition && program.progress<definition.work,'science','unknown or completed program');
  }
  requireValid((game.state.purchases['observing-grant']??0)<=game.state.science.publications,'grants','grants exceed Publications');
  requireValid(!game.state.course || game.state.course.progress < balance.course.work,'course','completed course must award a graduate');
}
