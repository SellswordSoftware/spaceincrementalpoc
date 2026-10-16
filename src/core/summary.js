import { getCapabilities, getUpgradeLevel, hasPrerequisite } from './rates.js';
import { planProduction } from './simulation.js';
import { stockIds } from './validate.js';
import { TICK_SECONDS } from './versions.js';

/** A detached view of rates for the next tick under current allocations/inputs.
 * @param {import('./types.js').GameState} game @param {import('./types.js').Definitions} definitions @param {import('./types.js').Balance} balance
 */
export function getSummary(game, definitions, balance) {
  const jobs = planProduction(game, definitions);
  const resources = stockIds.map(id => {
    const grossRate = jobs.reduce((sum, job) => sum + (job.outputs[id] ?? 0) / TICK_SECONDS, 0);
    const consumptionRate = jobs.reduce((sum, job) => sum + (job.inputs[id] ?? 0) / TICK_SECONDS, 0);
    const definition = definitions.resources.find(item => item.id === id);
    return { id, amount: game.state.resources[id], grossRate, consumptionRate, netRate: grossRate - consumptionRate,
      revealed: Boolean(definition && hasPrerequisite(game, definition.revealAt)) };
  });
  return {
    tick: game.state.clock.tick, seconds: game.state.clock.tick * TICK_SECONDS,
    campaignIndex: game.state.clock.campaignIndex, resources, jobs,
    capabilities: getCapabilities(game, definitions),
    upgrades: definitions.upgrades.map(upgrade => ({ id: upgrade.id, level: getUpgradeLevel(game, upgrade.id),
      revealed: upgrade.revealPrerequisites.every(id => hasPrerequisite(game, id)) })),
  };
}
