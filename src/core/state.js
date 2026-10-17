import { multiplier } from './rates.js';
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
    academy:{timers:[],remainder:0},science:{publications:0},reviewedOptions:[],joint:{completedAtTick:null},journal:['moon'],nextActionTick:0,modified:false};
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
  // Migrate only exact bundled prior configurations; retain their economic progress.
  const previousSingleData=candidate?.schemaVersion===6 && candidate.contentVersion==='0.7.0-single-data'
    && candidate.simulationVersion==='0.7.0-single-data' && candidate.balanceId==='single-data-v1' && candidate.balanceHash==='fnv1a32-4f42765e';
  const previousPrograms=candidate?.schemaVersion===7 && candidate.contentVersion==='0.8.0-programs'
    && candidate.simulationVersion==='0.8.0-programs' && candidate.balanceId==='programs-v1' && candidate.balanceHash==='fnv1a32-dc9d1e78';
  const previousInsight=candidate?.schemaVersion===8 && candidate.contentVersion==='0.9.0-insight'
    && candidate.simulationVersion==='0.9.0-insight' && candidate.balanceId==='insight-v1' && candidate.balanceHash==='fnv1a32-a0c29bc6';
  const previousParallel=candidate?.schemaVersion===9 && candidate.contentVersion==='0.10.0-parallel'
    && candidate.simulationVersion==='0.10.0-parallel' && candidate.balanceId==='parallel-v1' && candidate.balanceHash==='fnv1a32-bef188b1';
  const previousEngineering=candidate?.schemaVersion===10 && candidate.contentVersion==='0.11.0-engineering'
    && candidate.simulationVersion==='0.11.0-engineering' && candidate.balanceId==='engineering-v1' && candidate.balanceHash==='fnv1a32-aeaacb8c';
  const previousHorizons=candidate?.schemaVersion===11 && candidate.contentVersion==='0.12.0-horizons'
    && candidate.simulationVersion==='0.12.0-horizons' && candidate.balanceId==='horizons-v1' && candidate.balanceHash==='fnv1a32-575bb458';
  const previousSynthesis=candidate?.schemaVersion===12 && candidate.contentVersion==='0.13.0-synthesis'
    && candidate.simulationVersion==='0.13.0-synthesis' && candidate.balanceId==='synthesis-v1' && candidate.balanceHash==='fnv1a32-7c876725';
  const previousProgression=candidate?.schemaVersion===13 && candidate.contentVersion==='0.14.0-progression'
    && candidate.simulationVersion==='0.14.0-progression' && candidate.balanceId==='progression-v1' && candidate.balanceHash==='fnv1a32-7b4ab164';
  if ((previousSingleData || previousPrograms || previousInsight || previousParallel || previousEngineering || previousHorizons || previousSynthesis || previousProgression) && definitions===defaultDefinitions && balance===defaultBalance) {
    candidate.schemaVersion=SAVE_SCHEMA_VERSION;
    candidate.contentVersion=definitions.contentVersion;
    candidate.balanceId=balance.id;
    candidate.balanceHash=getBalanceHash(balance,definitions);
    candidate.simulationVersion=SIMULATION_VERSION;
    if (!previousSynthesis && !previousProgression) candidate.state.joint={programs:{},finaleProgress:null,completedAtTick:null};
    if (!previousHorizons && !previousSynthesis && !previousProgression) candidate.state.missions={};
    if (previousSingleData) candidate.state.science={publications:0,program:null};
    if (!previousInsight && !previousParallel && !previousEngineering && !previousHorizons && !previousSynthesis && !previousProgression) candidate.state.insight={points:0,totalEarned:0,upgrades:{},phase:'playing',lastAward:0};
    if (!previousParallel && !previousEngineering && !previousHorizons && !previousSynthesis && !previousProgression) {
      const old=candidate.state;
      const classrooms=old.purchases.academy?1+(old.purchases['appoint-teacher']??0):0;
      const teams=old.purchases.photometry?1+(old.purchases['appoint-scientist']??0):0;
      old.academy={timers:Array.from({length:classrooms},(_,i)=>i===0?Math.min(old.course?.progress??0,39.75):0),remainder:0};
      old.science={publications:old.science.publications,timers:Array.from({length:teams},(_,i)=>i===0?Math.min(old.science.program?.progress??0,59.75):0),remainder:0};
      delete old.course;
    }
    const old=candidate.state;
    const scienceFactor=multiplier(candidate,definitions,'science');
    const creditFactor=multiplier(candidate,definitions,'collaboration');
    let publications=old.science.publications+(old.science.remainder??0);
    for (const progress of old.science.timers) publications+=progress/60*scienceFactor;
    for (const [id,mission] of Object.entries(old.missions)) {
      publications+=mission.remainder+mission.progress/60*(id==='infrared'?2:1)*scienceFactor;
    }
    for (const [id,program] of Object.entries(old.joint.programs)) {
      const index=['changing-sky','planetary-systems','deep-time'].indexOf(id);
      publications+=program.publicationRemainder+program.progress/60*(index+2)*scienceFactor;
      old.resources.C+=program.remainder+program.progress/60*(index+1)*creditFactor;
    }
    // Existing joint programs acquire dedicated staff without taking prior unassigned graduates.
    old.population.total+=Object.keys(old.joint.programs).length;
    old.science={publications};
    old.reviewedOptions=Object.keys(old.purchases).filter(id=>old.purchases[id]>0);
    old.joint={completedAtTick:old.joint.completedAtTick??(old.purchases['network-synthesis']?old.clock.tick:null)};
    delete old.missions;
  }
  // Pure balance migration: retain the exact continuous-production state.
  const previousProduction=candidate?.schemaVersion===14 && candidate.contentVersion==='0.15.0-production'
    && candidate.simulationVersion==='0.15.0-production' && candidate.balanceId==='production-v1' && candidate.balanceHash==='fnv1a32-66e896fc';
  if (previousProduction && definitions===defaultDefinitions && balance===defaultBalance) {
    candidate.contentVersion=definitions.contentVersion;
    candidate.balanceId=balance.id;
    candidate.balanceHash=getBalanceHash(balance,definitions);
    candidate.simulationVersion=SIMULATION_VERSION;
  }
  if (candidate?.schemaVersion !== SAVE_SCHEMA_VERSION) {
    throw new ValidationError('save','This save uses a different economy. Keep the export and start a new station prototype.');
  }
  validateGame(candidate,definitions,balance); return candidate;
}
