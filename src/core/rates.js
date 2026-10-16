/** @typedef {import('./types.js').GameState} GameState */
/** @typedef {import('./types.js').Definitions} Definitions */

/** @param {GameState} game @param {string} id */
export function getUpgradeLevel(game, id) {
  return game.state.institution.upgrades[id] ?? game.state.campaign.upgrades[id] ?? game.state.legacy.upgrades[id] ?? 0;
}

/** @param {GameState} game @param {string} id */
export function hasPrerequisite(game, id) {
  return game.state.lifetime.unlocked.includes(id) || getUpgradeLevel(game, id) > 0
    || game.state.institution.instruments.some(instrument => instrument.definitionId === id);
}

/** Add bonuses within persistence categories; multiply the distinct categories.
 * @param {GameState} game @param {Definitions} definitions @param {import('./types.js').StatId} stat
 */
export function explainModifier(game, definitions, stat) {
  /** @type {Record<string, number>} */
  const categories = {};
  const contributions = [];
  for (const upgrade of definitions.upgrades) {
    const level = getUpgradeLevel(game, upgrade.id);
    if (!level) continue;
    for (const effect of upgrade.effects) {
      if (effect.kind !== 'multiply' || effect.stat !== stat) continue;
      const bonus = (effect.value - 1) * level;
      categories[upgrade.persistence] = (categories[upgrade.persistence] ?? 0) + bonus;
      contributions.push({ upgradeId: upgrade.id, category: upgrade.persistence, level, bonus });
    }
  }
  return { stat, multiplier: Object.values(categories).reduce((total, bonus) => total * (1 + bonus), 1), contributions };
}

/** @param {GameState} game @param {Definitions} definitions @param {import('./types.js').Job} job */
export function getJobRate(game, definitions, job) {
  const recipe = definitions.recipes.find(item => item.id === job.recipeId);
  const blockedReasons = [];
  if (!recipe) return { capacity: 0, blockedReasons: ['Unknown recipe'], modifier: null };
  for (const id of recipe.prerequisites) if (!hasPrerequisite(game, id)) blockedReasons.push(`Requires ${id}`);
  if (job.allocation === 0) blockedReasons.push('Allocation is zero');
  if (recipe.requiresFounder && game.state.population.founder.task !== job.id) blockedReasons.push('Founder assigned elsewhere');
  if (recipe.compatibleInstruments.length > 0) {
    const instrument = game.state.institution.instruments.find(item => item.id === job.instrumentId);
    if (!instrument || !recipe.compatibleInstruments.includes(instrument.definitionId)) blockedReasons.push('Requires a compatible instrument');
    const activity = recipe.activity;
    if (activity?.kind === 'observe' && instrument && !definitions.instruments.find(item => item.id === instrument.definitionId)?.tasks.includes(activity.targetId)) blockedReasons.push('Instrument cannot observe this target');
  }
  if (recipe.workRequired !== null && job.progress >= recipe.workRequired) blockedReasons.push('Completed');
  const modifier = recipe.stat ? explainModifier(game, definitions, recipe.stat) : null;
  return { capacity: blockedReasons.length ? 0 : recipe.capacity * job.allocation * (modifier?.multiplier ?? 1), blockedReasons, modifier };
}

/** @param {GameState} game @param {Definitions} definitions */
export function getCapabilities(game, definitions) {
  const capabilities = new Set();
  for (const upgrade of definitions.upgrades) {
    if (!getUpgradeLevel(game, upgrade.id)) continue;
    for (const effect of upgrade.effects) if (effect.kind === 'unlock') capabilities.add(effect.capability);
  }
  return [...capabilities].sort();
}
