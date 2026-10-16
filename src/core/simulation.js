import { dispatch } from './commands.js';
import { getJobRate, hasPrerequisite } from './rates.js';
import { requireValid } from './schema.js';
import { stockIds } from './validate.js';
import { TICK_SECONDS } from './versions.js';

const ROUNDING_EPSILON = 1e-9;

/** @param {number} stock @param {number} amount */
function consume(stock, amount) {
  const remainder = stock - amount;
  requireValid(Number.isFinite(remainder) && remainder >= -ROUNDING_EPSILON, 'production', 'input reservation exceeded available stock');
  return Math.max(0, remainder);
}

/** @typedef {import('./types.js').GameState} GameState */
/** @typedef {import('./types.js').Definitions} Definitions */
/** @typedef {import('./types.js').StockId} StockId */

/** Plan one production phase without mutating state. Higher priority runs first;
 * equal priorities use ascending job ID (code-unit order, independent of locale).
 * @param {GameState} game @param {Definitions} definitions
 */
export function planProduction(game, definitions) {
  const available = { ...game.state.resources };
  const jobs = [...game.state.jobs].sort((a, b) => b.priority - a.priority || (a.id < b.id ? -1 : a.id > b.id ? 1 : 0));
  return jobs.map(job => {
    const recipe = definitions.recipes.find(item => item.id === job.recipeId);
    if (!recipe) throw new Error(`Unknown recipe ${job.recipeId}`);
    const rate = getJobRate(game, definitions, job);
    const requested = Math.min(rate.capacity * TICK_SECONDS, recipe.workRequired === null ? Infinity : Math.max(0, recipe.workRequired - job.progress));
    requireValid(Number.isFinite(requested), job.id, 'nonfinite requested work');
    let work = requested;
    for (const key of stockIds) {
      const cost = recipe.inputs[key] ?? 0;
      if (cost > 0) work = Math.min(work, available[key] / cost);
    }
    const blockedReasons = [...rate.blockedReasons];
    /** @type {Partial<Record<StockId, number>>} */
    const inputs = {};
    /** @type {Partial<Record<StockId, number>>} */
    const outputs = {};
    for (const key of stockIds) {
      const cost = recipe.inputs[key] ?? 0;
      if (cost > 0 && available[key] / cost < requested) blockedReasons.push(`Insufficient ${key}`);
      inputs[key] = cost * work;
      outputs[key] = (recipe.outputs[key] ?? 0) * work;
      available[key] = consume(available[key], inputs[key]);
    }
    return { jobId: job.id, recipeId: recipe.id, requested, work, inputs, outputs, blockedReasons, modifier: rate.modifier };
  });
}

/** @param {GameState} game @param {Definitions} definitions @returns {import('./types.js').GameEvent[]} */
function advanceOneTick(game, definitions) {
  const plan = planProduction(game, definitions);
  // Reserve from the snapshot first; production cannot fund another job this tick.
  const nextStocks = { ...game.state.resources };
  for (const item of plan) for (const key of stockIds) nextStocks[key] = consume(nextStocks[key], item.inputs[key] ?? 0);
  for (const item of plan) for (const key of stockIds) nextStocks[key] += item.outputs[key] ?? 0;
  for (const key of stockIds) requireValid(Number.isFinite(nextStocks[key]), key, 'nonfinite production output');
  Object.assign(game.state.resources, nextStocks);
  /** @type {import('./types.js').GameEvent[]} */
  const events = [];
  const nextTick = game.state.clock.tick + 1;
  for (const item of plan) {
    const job = game.state.jobs.find(job => job.id === item.jobId);
    const recipe = definitions.recipes.find(recipe => recipe.id === item.recipeId);
    if (!job || !recipe) continue;
    job.progress += item.work;
    if (recipe.workRequired !== null && item.work > 0 && job.progress >= recipe.workRequired) {
      job.progress = recipe.workRequired;
      job.allocation = 0;
      if (game.state.population.founder.task === job.id) game.state.population.founder.task = 'idle';
      events.push({ tick: nextTick, type: 'jobCompleted', id: job.id, detail: recipe.name });
    }
  }
  // Only explicitly automatic gates qualify. A prerequisite alone never grants
  // a lunar record, publication, or other accomplishment reserved for P3+.
  const gates = [...definitions.gates].sort((a, b) => a.id < b.id ? -1 : a.id > b.id ? 1 : 0);
  const newlyUnlocked = gates.filter(gate => gate.autoUnlock && !game.state.lifetime.unlocked.includes(gate.id)
    && gate.prerequisites.every(id => hasPrerequisite(game, id)));
  for (const gate of newlyUnlocked) {
    game.state.lifetime.unlocked.push(gate.id);
    events.push({ tick: nextTick, type: 'unlocked', id: gate.id, detail: 'Prerequisites satisfied' });
  }
  game.state.clock.tick = nextTick;
  return events;
}

/** No timers or alternate tick sizes: acceleration executes identical 0.25 s ticks.
 * Scheduled command ticks are absolute and sequence numbers set same-tick order.
 * A schedule may be reused across chunked calls; past/future entries are ignored.
 * @param {GameState} game @param {Definitions} definitions @param {import('./types.js').Balance} balance @param {number} count
 * @param {{tick: number, sequence: number, command: import('./types.js').Command}[]} [schedule]
 */
export function advanceTicks(game, definitions, balance, count, schedule = []) {
  requireValid(Number.isSafeInteger(count) && count >= 0 && Number.isSafeInteger(game.state.clock.tick + count), 'ticks', 'expected a nonnegative safe tick count');
  const endTick = game.state.clock.tick + count;
  const commands = schedule.filter(item => item.tick >= game.state.clock.tick && item.tick < endTick)
    .sort((a, b) => a.tick - b.tick || a.sequence - b.sequence);
  const keys = new Set();
  for (const item of commands) {
    const key = `${item.tick}:${item.sequence}`;
    requireValid(Number.isSafeInteger(item.tick) && Number.isSafeInteger(item.sequence) && item.sequence >= 0 && !keys.has(key), 'schedule', 'expected unique integer tick/sequence pairs');
    keys.add(key);
  }
  /** @type {import('./types.js').GameEvent[]} */
  const events = [];
  /** @type {import('./types.js').CommandRecord[]} */
  const acceptedCommands = [];
  /** @type {import('./types.js').CommandRecord[]} */
  const rejectedCommands = [];
  let commandIndex = 0;
  while (game.state.clock.tick < endTick) {
    while (commands[commandIndex]?.tick === game.state.clock.tick) {
      const { command } = commands[commandIndex++];
      const result = dispatch(game, definitions, balance, command);
      (result.ok ? acceptedCommands : rejectedCommands).push({ tick: game.state.clock.tick, command, result });
      events.push(...result.events);
    }
    events.push(...advanceOneTick(game, definitions));
  }
  return { events, acceptedCommands, rejectedCommands };
}
