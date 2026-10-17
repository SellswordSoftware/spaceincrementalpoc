import { productionRates } from './rates.js';
import { advanceProjects, produce } from './commands.js';
import { TICK_SECONDS } from './versions.js';

/** @param {import('./types.js').GameState} game @param {import('./types.js').Definitions} definitions
 * @param {import('./types.js').Balance} balance @param {number} count
 * @returns {{events:import('./types.js').GameEvent[]}}
 */
export function advanceTicks(game, definitions, balance, count) {
  if (!Number.isSafeInteger(count) || count < 0) throw new Error('Tick count must be a nonnegative integer');
  if (game.state.insight.phase==='shop') return {events:[]};
  const rates = productionRates(game,definitions,balance);
  /** @type {import('./types.js').GameEvent[]} */
  const events = [];
  for (let index=0;index<count;index++) {
    produce(game,definitions,rates,TICK_SECONDS);
    game.state.clock.tick++;
    events.push(...advanceProjects(game,definitions,balance,TICK_SECONDS));
  }
  return {events};
}
