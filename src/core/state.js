import { definitions as defaultDefinitions } from '../definitions/content.js';
import { balance as defaultBalance } from '../definitions/balance.js';
import { canonicalStringify, getBalanceHash } from './serialization.js';
import { validateDefinitions, validateBalance, ValidationError } from './validate.js';
import { validateGame } from './validate-state.js';
import { SAVE_SCHEMA_VERSION, SIMULATION_VERSION } from './versions.js';

/** @param {import('./types.js').Definitions} [definitions]
 * @param {import('./types.js').Balance} [balance]
 * @returns {import('./types.js').GameState}
 */
export function createGame(definitions = defaultDefinitions, balance = defaultBalance) {
  validateDefinitions(definitions);
  validateBalance(balance);
  const game = {
    schemaVersion: SAVE_SCHEMA_VERSION,
    contentVersion: definitions.contentVersion,
    balanceId: balance.id,
    balanceHash: getBalanceHash(balance, definitions),
    simulationVersion: SIMULATION_VERSION,
    state: {
      clock: { tick: 0, campaignStartTick: 0, campaignIndex: 1 },
      resources: { ...balance.startingStocks },
      institution: {
        instruments: [{ id: 'founding-telescope', definitionId: 'starter-refractor' }],
        upgrades: {},
      },
      population: { founder: { task: 'idle' }, groups: [] },
      data: [], jobs: definitions.recipes.filter(recipe => recipe.activity?.kind === 'donations').map(recipe => ({
        id: recipe.id, recipeId: recipe.id, instrumentId: null, allocation: 1, priority: 0, progress: 0,
      })),
      investigations: { evidence: [], activePrograms: [], completedPrograms: [] },
      campaign: { upgrades: {}, publications: 0, scientificOutput: 0, interestEarned: 0 },
      lifetime: { journal: [], unlocked: ['backyard'], claimedDepthBonuses: [] },
      legacy: { balance: balance.startingLegacy, upgrades: {}, purchaseHistory: [] },
      preferences: { assignments: [], audience: { donations: 1, recruitment: 0 } },
      modified: false,
    },
  };
  validateGame(game, definitions, balance);
  return game;
}

/** @param {import('./types.js').GameState} game
 * @param {import('./types.js').Definitions} [definitions]
 * @param {import('./types.js').Balance} [balance]
 */
export function serializeGame(game, definitions = defaultDefinitions, balance = defaultBalance) {
  validateGame(game, definitions, balance);
  return canonicalStringify(game);
}

/** Parse into a separate state. The caller replaces its active game only on success.
 * @param {string} json
 * @param {import('./types.js').Definitions} [definitions]
 * @param {import('./types.js').Balance} [balance]
 * @returns {import('./types.js').GameState}
 */
export function deserializeGame(json, definitions = defaultDefinitions, balance = defaultBalance) {
  let candidate;
  try {
    candidate = JSON.parse(json);
  } catch {
    throw new ValidationError('save', 'invalid JSON');
  }
  validateGame(candidate, definitions, balance);
  return candidate;
}
