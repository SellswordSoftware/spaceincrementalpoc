import { object, dictionary, array, integer, nonnegative, text, id, choice, boolean, requireValid } from './schema.js';
import { getBalanceHash } from './serialization.js';
import { SAVE_SCHEMA_VERSION, SIMULATION_VERSION } from './versions.js';
import { grantCount } from './availability.js';
import { populationSummary } from './people.js';

const target = choice(['moon','jupiter','saturn','star-clusters','nebulae','galaxies','galaxy-clusters','radio-sources','transit-targets','infrared-fields','deep-field']);
const stocks = object({D:nonnegative,F:nonnegative,K:nonnegative,I:nonnegative,X:nonnegative,E:nonnegative,C:nonnegative});
/** @param {unknown} value @param {string} path */
const nullableTick = (value,path)=>{if(value!==null)integer(value,path);};
const state = object({clock:object({tick:integer,totalTicks:integer,totalIsPartial:boolean,campaignIndex:integer,prestigeEligibleAtTick:nullableTick,eligibilityKnown:boolean,completedRuns:array(object({run:integer,eligibleAtTick:nullableTick,endedAtTick:integer,insight:integer}))}),resources:stocks,insight:object({points:integer,totalEarned:integer,upgrades:dictionary(id,integer),phase:choice(['playing','shop']),lastAward:integer}),purchases:dictionary(id,integer),
  population:object({total:integer}),academy:object({timers:array(nonnegative),remainder:nonnegative}),
  science:object({publications:nonnegative}),reviewedOptions:array(id),
  joint:object({completedAtTick:(value,path)=>{if(value!==null)integer(value,path);}}),
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
  requireValid(game.state.clock.prestigeEligibleAtTick===null || game.state.clock.prestigeEligibleAtTick<=game.state.clock.tick,'clock','eligibility cannot be in the future');
  requireValid(game.state.clock.totalTicks>=game.state.clock.tick,'clock','total time must include the current run');
  requireValid(game.state.clock.campaignIndex>=1,'run','run number must be positive');
  if (game.state.insight.phase==='shop') {
    requireValid(Object.keys(game.state.purchases).length===0 && game.state.population.total===0 && game.state.academy.timers.length===0
      && game.state.science.publications===0 && game.state.reviewedOptions.length===0 && game.state.joint.completedAtTick===null && game.state.clock.tick===0
      && Object.entries(game.state.resources).every(([key,value])=>value===balance.startingStocks[/** @type {import('./types.js').StockId} */(key)]),
      'prestige','between-run state must have reset ordinary progress');
  }
  for (const [key,count] of Object.entries(game.state.purchases)) {
    const item = definitions.investments.find(item => item.id === key);
    requireValid(item && count <= item.maxLevel,'purchases',`unknown or excessive purchase ${key}`);
  }
  requireValid(populationSummary(game,definitions).available >= 0,'population','appointments exceed graduates');
  const academy=game.state.academy;
  const expected=game.state.purchases.academy?1+(game.state.purchases['appoint-teacher']??0):0;
  requireValid(academy.timers.length===expected && academy.timers.every(time=>time<balance.course.seconds),'academy','timer count or cycle progress mismatch');
  requireValid(academy.remainder<1 && (expected>0 || academy.remainder===0),'academy','invalid fractional reward');
  requireValid(game.state.reviewedOptions.every(id=>definitions.investments.some(item=>item.id===id)),'reviewedOptions','unknown option');
  const joint=game.state.joint;
  requireValid(Boolean(game.state.purchases[definitions.finale.investmentId])===(joint.completedAtTick!==null),'finale','purchase and completion must agree');
  requireValid(joint.completedAtTick===null || joint.completedAtTick<=game.state.clock.tick,'finale','completion is in the future');
  requireValid(grantCount(game,definitions)<=Math.floor(game.state.science.publications+1e-9),'grants','grants exceed Publications');
}
