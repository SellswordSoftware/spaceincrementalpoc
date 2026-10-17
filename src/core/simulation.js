import { availableInvestments, unlockEvents } from './availability.js';
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
  const before=availableInvestments(game,definitions).map(item=>item.id);
  const rates = productionRates(game,definitions,balance);
  /** @type {import('./types.js').GameEvent[]} */
  const events = [];
  for (let index=0;index<count;index++) {
    produce(game,definitions,rates,TICK_SECONDS);
    game.state.clock.tick++;
    game.state.clock.totalTicks++;
    events.push(...advanceProjects(game,definitions,balance,TICK_SECONDS));
  }
  events.push(...unlockEvents(before,game,definitions));
  return {events};
}
