import { getCapabilities, getUpgradeLevel, hasPrerequisite } from './rates.js';
import { planProduction } from './simulation.js';
import { stockIds } from './validate.js';
import { TICK_SECONDS } from './versions.js';

/** A detached view of rates for the next tick under current allocations/inputs.
 * @param {import('./types.js').GameState} game @param {import('./types.js').Definitions} definitions @param {import('./types.js').Balance} balance
 */
export function getSummary(game, definitions, balance) {
  const jobs = planProduction(game, definitions);
  const outreach = definitions.recipes.find(recipe => recipe.activity?.kind === 'outreach')?.activity;
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
    data: definitions.targets.map(target => ({ targetId: target.id, type: target.dataType,
      queued: game.state.data.filter(lot => lot.targetId === target.id).reduce((sum, lot) => sum + Math.max(0, lot.quantity - lot.consumed), 0),
      evidence: game.state.investigations.evidence.filter(item => item.targetId === target.id).reduce((sum, item) => sum + item.quantity, 0),
      acquisitionRate: jobs.reduce((sum, job) => sum + (job.dataOutput?.targetId === target.id ? job.dataOutput.quantity / TICK_SECONDS : 0), 0),
      processingRate: jobs.reduce((sum, job) => sum + job.dataInputs.filter(input => game.state.data.some(lot => lot.id === input.lotId && lot.targetId === target.id)).reduce((amount, input) => amount + input.quantity / TICK_SECONDS, 0), 0),
    })),
    audience: { ...game.state.preferences.audience, interestEarned: game.state.campaign.interestEarned,
      cap: outreach?.kind === 'outreach' ? outreach.interestCap : null },
    milestones: definitions.gates.filter(gate => gate.condition).map(gate => ({ id: gate.id, completed: game.state.lifetime.unlocked.includes(gate.id), condition: { ...gate.condition } })),
    capabilities: getCapabilities(game, definitions),
    upgrades: definitions.upgrades.map(upgrade => ({ id: upgrade.id, level: getUpgradeLevel(game, upgrade.id),
      revealed: upgrade.revealPrerequisites.every(id => hasPrerequisite(game, id)) })),
  };
}
