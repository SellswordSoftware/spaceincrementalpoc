import { definitions as defaultDefinitions } from '../definitions/content.js';
import { balance as defaultBalance } from '../definitions/balance.js';
import { canonicalStringify, getBalanceHash } from './serialization.js';
import { validateDefinitions, validateBalance, ValidationError } from './validate.js';
import { validateGame } from './validate-state.js';
import { SAVE_SCHEMA_VERSION, SIMULATION_VERSION } from './versions.js';

/** Everything except Insight is rebuilt from the starter state.
 * @param {import('./types.js').Balance} balance @param {number} [campaignIndex]
 * @param {import('./types.js').InsightState} [insight] @returns {import('./types.js').State} */
export function createRunState(balance,campaignIndex=1,insight={points:0,totalEarned:0,upgrades:{},phase:'playing',lastAward:0}) {
  return {clock:{tick:0,campaignIndex},insight,resources:{...balance.startingStocks},purchases:{},population:{total:0},
    course:null,science:{publications:0,program:null},journal:['moon'],nextActionTick:0,modified:false};
}

/** @param {import('./types.js').Definitions} [definitions] @param {import('./types.js').Balance} [balance]
 * @returns {import('./types.js').GameState}
 */
export function createGame(definitions=defaultDefinitions, balance=defaultBalance) {
  validateDefinitions(definitions); validateBalance(balance);
  return {schemaVersion:SAVE_SCHEMA_VERSION,contentVersion:definitions.contentVersion,balanceId:balance.id,
    balanceHash:getBalanceHash(balance,definitions),simulationVersion:SIMULATION_VERSION,
    state:createRunState(balance)};
}

/** @param {import('./types.js').GameState} game @param {import('./types.js').Definitions} [definitions] @param {import('./types.js').Balance} [balance] */
export function serializeGame(game,definitions=defaultDefinitions,balance=defaultBalance) {
  validateGame(game,definitions,balance); return canonicalStringify(game);
}

/** @param {string} json @param {import('./types.js').Definitions} [definitions] @param {import('./types.js').Balance} [balance]
 * @returns {import('./types.js').GameState}
 */
export function deserializeGame(json,definitions=defaultDefinitions,balance=defaultBalance) {
  let candidate;
  try { candidate=JSON.parse(json); } catch { throw new ValidationError('save','invalid JSON'); }
  // Preserve the exact bundled P5 single-Data and P6 program economies.
  const previousSingleData=candidate?.schemaVersion===6 && candidate.contentVersion==='0.7.0-single-data'
    && candidate.simulationVersion==='0.7.0-single-data' && candidate.balanceId==='single-data-v1' && candidate.balanceHash==='fnv1a32-4f42765e';
  const previousPrograms=candidate?.schemaVersion===7 && candidate.contentVersion==='0.8.0-programs'
    && candidate.simulationVersion==='0.8.0-programs' && candidate.balanceId==='programs-v1' && candidate.balanceHash==='fnv1a32-dc9d1e78';
  if ((previousSingleData || previousPrograms) && definitions===defaultDefinitions && balance===defaultBalance) {
    candidate.schemaVersion=SAVE_SCHEMA_VERSION;
    candidate.contentVersion=definitions.contentVersion;
    candidate.balanceId=balance.id;
    candidate.balanceHash=getBalanceHash(balance,definitions);
    candidate.simulationVersion=SIMULATION_VERSION;
    if (previousSingleData) candidate.state.science={publications:0,program:null};
    candidate.state.insight={points:0,totalEarned:0,upgrades:{},phase:'playing',lastAward:0};
  }
  if (candidate?.schemaVersion !== SAVE_SCHEMA_VERSION) {
    throw new ValidationError('save','This save uses a different economy. Keep the export and start a new station prototype.');
  }
  validateGame(candidate,definitions,balance); return candidate;
}
