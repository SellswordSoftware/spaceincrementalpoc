import { definitions as defaultDefinitions } from '../definitions/content.js';
import { balance as defaultBalance } from '../definitions/balance.js';
import { array, boolean, choice, dictionary, emptyArray, id, integer, nonnegative, object, requireValid, text } from './schema.js';
import { getBalanceHash } from './serialization.js';
import { validateBalance, validateDefinitions } from './validate.js';
import { SAVE_SCHEMA_VERSION, SIMULATION_VERSION } from './versions.js';

const levels = dictionary(id, integer);
const stateSchema = object({
  clock: object({ tick: integer, campaignStartTick: integer, campaignIndex: integer }),
  resources: object({ F: nonnegative, K: nonnegative, I: nonnegative, X: nonnegative, E: nonnegative, C: nonnegative }),
  institution: object({ instruments: array(object({ id, definitionId: id })), upgrades: levels }),
  population: object({ founder: object({ task: id }), groups: emptyArray }),
  data: array(object({ id, targetId: id, type: id, instrumentId: id, mode: choice(['visual', 'camera']), startTick: integer, endTick: integer, quantity: nonnegative, consumed: nonnegative })),
  jobs: array(object({ id, recipeId: id, instrumentId: (value, path) => { if (value !== null) id(value, path); }, allocation: nonnegative, priority: integer, progress: nonnegative })),
  investigations: object({ evidence: array(object({ lotId: id, targetId: id, type: id, mode: choice(['visual', 'camera']), startTick: integer, endTick: integer, quantity: nonnegative, allocated: nonnegative })), activePrograms: emptyArray, completedPrograms: emptyArray }),
  campaign: object({ upgrades: levels, publications: integer, scientificOutput: nonnegative, interestEarned: nonnegative }),
  lifetime: object({ journal: array(id), unlocked: array(id), claimedDepthBonuses: emptyArray }),
  legacy: object({ balance: integer, upgrades: levels, purchaseHistory: emptyArray }),
  preferences: object({ assignments: emptyArray, audience: object({ donations: nonnegative, recruitment: nonnegative }) }), modified: boolean,
});
const envelopeSchema = object({
  schemaVersion: integer, contentVersion: text, balanceId: id, balanceHash: text,
  simulationVersion: text, state: stateSchema,
});

/** Validate a complete save without altering it or the current game.
 * Unimplemented subsystem arrays deliberately accept only empty arrays.
 * @param {unknown} input
 * @param {import('./types.js').Definitions} [definitions]
 * @param {import('./types.js').Balance} [balance]
 * @returns {asserts input is import('./types.js').GameState}
 */
export function validateGame(input, definitions = defaultDefinitions, balance = defaultBalance) {
  validateDefinitions(definitions);
  validateBalance(balance);
  envelopeSchema(input, 'save');
  const game = /** @type {import('./types.js').GameState} */ (input);
  requireValid(game.schemaVersion === SAVE_SCHEMA_VERSION, 'save.schemaVersion', `unsupported save schema ${game.schemaVersion}; expected ${SAVE_SCHEMA_VERSION}`);
  requireValid(game.contentVersion === definitions.contentVersion, 'save.contentVersion', 'content version mismatch; start a new scenario');
  requireValid(game.simulationVersion === SIMULATION_VERSION, 'save.simulationVersion', 'simulation version mismatch; start a new scenario');
  requireValid(game.balanceId === balance.id && game.balanceHash === getBalanceHash(balance, definitions), 'save.balanceHash', 'balance configuration mismatch; start a new scenario');
  const state = game.state;
  requireValid(state.clock.campaignIndex >= 1, 'clock.campaignIndex', 'campaign numbering starts at one');
  requireValid(state.clock.campaignStartTick <= state.clock.tick, 'clock.campaignStartTick', 'cannot be after current tick');
  const instruments = state.institution.instruments;
  requireValid(new Set(instruments.map(i => i.id)).size === instruments.length, 'institution.instruments', 'duplicate instrument instance ID');
  requireValid(new Set(instruments.map(i => i.definitionId)).size === instruments.length, 'institution.instruments', 'only one instrument per definition is currently supported');
  for (const instrument of instruments) {
    requireValid(definitions.instruments.some(i => i.id === instrument.definitionId), instrument.id, 'unknown instrument definition');
  }
  requireValid(instruments.some(i => i.id === 'founding-telescope' && i.definitionId === 'starter-refractor'), 'institution.instruments', 'founding telescope must be retained');
  requireValid(state.preferences.audience.donations + state.preferences.audience.recruitment <= 1, 'preferences.audience', 'audience overallocated');
  requireValid(new Set(state.data.map(lot => lot.id)).size === state.data.length, 'data', 'duplicate lot ID');
  for (const lot of state.data) {
    const target = definitions.targets.find(target => target.id === lot.targetId);
    requireValid(target && target.dataType === lot.type, lot.id, 'unknown target or incorrect data type');
    requireValid(instruments.some(instrument => instrument.id === lot.instrumentId && definitions.instruments.some(definition => definition.id === instrument.definitionId && definition.tasks.includes(lot.targetId))), lot.id, 'incompatible source instrument');
    requireValid(lot.consumed <= lot.quantity + 1e-9 && lot.startTick < lot.endTick && lot.endTick <= state.clock.tick, lot.id, 'invalid data quantity or interval');
  }
  requireValid(new Set(state.investigations.evidence.map(item => item.lotId)).size === state.investigations.evidence.length, 'evidence', 'duplicate source lot');
  for (const evidence of state.investigations.evidence) {
    const lot = state.data.find(lot => lot.id === evidence.lotId);
    requireValid(lot && lot.targetId === evidence.targetId && lot.type === evidence.type && lot.mode === evidence.mode, evidence.lotId, 'invalid evidence provenance');
    requireValid(evidence.quantity <= lot.consumed + 1e-9 && evidence.allocated <= evidence.quantity && evidence.startTick === lot.startTick && evidence.endTick <= lot.endTick && evidence.endTick > evidence.startTick, evidence.lotId, 'invalid evidence quantity or interval');
  }

  requireValid(new Set(state.jobs.map(job => job.id)).size === state.jobs.length, 'jobs', 'duplicate job ID');
  for (const job of state.jobs) {
    const recipe = definitions.recipes.find(item => item.id === job.recipeId);
    requireValid(recipe, job.id, 'unknown job recipe');
    requireValid(job.allocation <= 1, job.id, 'allocation exceeds one');
    requireValid(recipe.workRequired === null || job.progress <= recipe.workRequired, job.id, 'progress exceeds completion work');
    const instrument = instruments.find(item => item.id === job.instrumentId);
    requireValid(recipe.compatibleInstruments.length ? instrument && recipe.compatibleInstruments.includes(instrument.definitionId) : job.instrumentId === null, job.id, 'incompatible job instrument');
  }
  for (const recipe of definitions.recipes) requireValid(state.jobs.filter(job => job.recipeId === recipe.id).reduce((sum, job) => sum + job.allocation, 0) <= 1, recipe.id, 'recipe overallocated');
  for (const instrument of instruments) requireValid(state.jobs.filter(job => job.instrumentId === instrument.id).reduce((sum, job) => sum + job.allocation, 0) <= 1, instrument.id, 'instrument overallocated');
  const founderJob = state.jobs.find(job => job.id === state.population.founder.task);
  requireValid(state.population.founder.task === 'idle' || founderJob && definitions.recipes.some(recipe => recipe.id === founderJob.recipeId && recipe.requiresFounder), 'population.founder.task', 'unknown founder job');

  /** @type {[Record<string, number>, string[]][]} */
  const upgradePartitions = [
    [state.institution.upgrades, ['installedHardware', 'permanentMethod', 'permanentAutomation', 'permanentQualification']],
    [state.campaign.upgrades, ['campaignOperation', 'campaignSpecialization', 'campaignCollaboration']],
    [state.legacy.upgrades, ['legacy']],
  ];
  for (const [upgrades, classes] of upgradePartitions) {
    for (const [key, level] of Object.entries(upgrades)) {
      const definition = definitions.upgrades.find(u => u.id === key);
      requireValid(definition, key, 'unknown upgrade');
      requireValid(classes.includes(definition.persistence), key, 'upgrade in incorrect persistence partition');
      requireValid(level > 0 && level <= definition.maxLevel, key, 'upgrade level out of bounds');
    }
  }
  for (const [key, values, known] of [
    ['journal', state.lifetime.journal, definitions.targets.map(t => t.id)],
    ['unlocked', state.lifetime.unlocked, definitions.gates.map(g => g.id)],
  ]) {
    requireValid(new Set(values).size === values.length, `lifetime.${key}`, 'duplicate entry');
    for (const value of values) requireValid(known.includes(value), `lifetime.${key}`, `unknown reference ${value}`);
  }
  requireValid(state.lifetime.unlocked.includes('backyard'), 'lifetime.unlocked', 'starter gate must remain unlocked');
}
