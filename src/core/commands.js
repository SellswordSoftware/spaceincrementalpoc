import { getUpgradeLevel, hasPrerequisite } from './rates.js';
import { choice, id, integer, nonnegative, object } from './schema.js';

/** @typedef {import('./types.js').GameState} GameState */
/** @typedef {import('./types.js').Definitions} Definitions */
/** @typedef {import('./types.js').Command} Command */

/** @param {GameState} game @param {Definitions} definitions @param {import('./types.js').Balance} balance @param {Command} command
 * @returns {import('./types.js').CommandQuote}
 */
export function quoteCommand(game, definitions, balance, command) {
  /** @type {import('./types.js').CommandQuote} */
  const quote = { ok: false, costs: {}, blockedReasons: [] };
  const blocked = quote.blockedReasons;
  try {
    if (command?.type === 'buyUpgrade') {
      object({ type: choice(['buyUpgrade']), upgradeId: id })(command, 'command');
      const upgrade = definitions.upgrades.find(item => item.id === command.upgradeId);
      if (!upgrade) blocked.push('Unknown upgrade');
      else {
        const level = getUpgradeLevel(game, upgrade.id);
        if (upgrade.persistence === 'legacy') blocked.push('Legacy purchases arrive with prestige');
        if (level >= upgrade.maxLevel) blocked.push('Maximum level reached');
        for (const ref of upgrade.purchasePrerequisites) if (!hasPrerequisite(game, ref)) blocked.push(`Requires ${ref}`);
        for (const [key, amount] of Object.entries(upgrade.cost.base)) {
          quote.costs[/** @type {import('./types.js').ResourceId} */ (key)] = amount * upgrade.cost.growth ** level;
        }
      }
    } else if (command?.type === 'purchaseInstrument') {
      object({ type: choice(['purchaseInstrument']), instrumentId: id })(command, 'command');
      const instrument = definitions.instruments.find(item => item.id === command.instrumentId);
      if (!instrument) blocked.push('Unknown instrument');
      else {
        quote.costs = { ...instrument.cost };
        if (game.state.institution.instruments.some(item => item.definitionId === instrument.id)) blocked.push('Instrument already owned');
        for (const ref of instrument.purchasePrerequisites) if (!hasPrerequisite(game, ref)) blocked.push(`Requires ${ref}`);
      }
    } else if (command?.type === 'setJobAllocation') {
      const { instrumentId, ...required } = command;
      object({ type: choice(['setJobAllocation']), jobId: id, recipeId: id, allocation: nonnegative })(required, 'command');
      if (instrumentId !== undefined && instrumentId !== null) id(instrumentId, 'command.instrumentId');
      if (command.allocation > 1) blocked.push('Allocation must be between zero and one');
      const recipe = definitions.recipes.find(item => item.id === command.recipeId);
      const existing = game.state.jobs.find(item => item.id === command.jobId);
      if (!recipe) blocked.push('Unknown recipe');
      else {
        if (existing && existing.recipeId !== recipe.id) blocked.push('An existing job cannot change recipe');
        if (command.allocation > 0) {
          for (const ref of recipe.prerequisites) if (!hasPrerequisite(game, ref)) blocked.push(`Requires ${ref}`);
          if (recipe.workRequired !== null && (existing?.progress ?? 0) >= recipe.workRequired) blocked.push('Job already completed');
        }
        const selectedInstrument = instrumentId === undefined ? existing?.instrumentId ?? null : instrumentId;
        const instrument = game.state.institution.instruments.find(item => item.id === selectedInstrument);
        if (recipe.compatibleInstruments.length && (!instrument || !recipe.compatibleInstruments.includes(instrument.definitionId))) blocked.push('Requires a compatible owned instrument');
        if (!recipe.compatibleInstruments.length && selectedInstrument !== null) blocked.push('This recipe does not use an instrument');
        const others = game.state.jobs.filter(item => item.id !== command.jobId);
        if (command.allocation + others.filter(item => item.recipeId === recipe.id).reduce((sum, item) => sum + item.allocation, 0) > 1) blocked.push('Recipe capacity is already allocated');
        if (selectedInstrument !== null && command.allocation + others.filter(item => item.instrumentId === selectedInstrument).reduce((sum, item) => sum + item.allocation, 0) > 1) blocked.push('Instrument capacity is already allocated');
      }
    } else if (command?.type === 'setAudienceAllocation') {
      object({ type: choice(['setAudienceAllocation']), donations: nonnegative, recruitment: nonnegative })(command, 'command');
      if (!hasPrerequisite(game, 'outreach')) blocked.push('Requires outreach');
      if (command.donations + command.recruitment > 1) blocked.push('Audience allocation cannot exceed one');
    } else if (command?.type === 'setFounderTask') {
      object({ type: choice(['setFounderTask']), jobId: (value, path) => { if (value !== null) id(value, path); } })(command, 'command');
      if (command.jobId !== null) {
        const job = game.state.jobs.find(item => item.id === command.jobId);
        const recipe = definitions.recipes.find(item => item.id === job?.recipeId);
        if (!job || !recipe?.requiresFounder) blocked.push('Choose an existing founder job');
      }
    } else if (command?.type === 'setJobPriority') {
      object({ type: choice(['setJobPriority']), jobId: id, priority: integer })(command, 'command');
      if (!game.state.jobs.some(item => item.id === command.jobId)) blocked.push('Unknown job');
    } else blocked.push('Unknown command');
  } catch (error) {
    blocked.push(error instanceof Error ? error.message : 'Invalid command');
  }
  for (const [key, amount] of Object.entries(quote.costs)) {
    const available = key === 'L' ? game.state.legacy.balance : game.state.resources[/** @type {import('./types.js').StockId} */ (key)];
    if (!Number.isFinite(amount) || amount < 0) blocked.push(`Invalid cost for ${key}`);
    else if (available === undefined || available < amount) blocked.push(`Insufficient ${key}`);
  }
  quote.ok = blocked.length === 0;
  return quote;
}

/** Commands apply at the current tick boundary. Rejected commands never mutate game state.
 * History belongs to the adapter: immediate callers retain this result; advanceTicks
 * returns separate accepted/rejected records for scheduled commands.
 * @param {GameState} game @param {Definitions} definitions @param {import('./types.js').Balance} balance @param {Command} command
 * @returns {import('./types.js').CommandResult}
 */
export function dispatch(game, definitions, balance, command) {
  const quote = quoteCommand(game, definitions, balance, command);
  if (!quote.ok) return { ...quote, events: [] };
  for (const [key, amount] of Object.entries(quote.costs)) {
    if (key === 'L') game.state.legacy.balance -= amount;
    else game.state.resources[/** @type {import('./types.js').StockId} */ (key)] -= amount;
  }
  let eventId = '';
  switch (command.type) {
    case 'buyUpgrade': {
      const upgrade = definitions.upgrades.find(item => item.id === command.upgradeId);
      if (!upgrade) throw new Error('Quoted upgrade is missing');
      const levels = upgrade.persistence.startsWith('campaign') ? game.state.campaign.upgrades : game.state.institution.upgrades;
      levels[upgrade.id] = getUpgradeLevel(game, upgrade.id) + 1;
      eventId = upgrade.id;
      break;
    }
    case 'purchaseInstrument':
      game.state.institution.instruments.push({ id: command.instrumentId, definitionId: command.instrumentId });
      eventId = command.instrumentId;
      break;
    case 'setJobAllocation': {
      let job = game.state.jobs.find(item => item.id === command.jobId);
      if (!job) {
        job = { id: command.jobId, recipeId: command.recipeId, instrumentId: null, allocation: 0, priority: 0, progress: 0 };
        game.state.jobs.push(job);
      }
      job.allocation = command.allocation;
      if (command.instrumentId !== undefined) job.instrumentId = command.instrumentId;
      eventId = job.id;
      break;
    }
    case 'setFounderTask':
      game.state.population.founder.task = command.jobId ?? 'idle';
      eventId = command.jobId ?? 'idle';
      break;
    case 'setAudienceAllocation':
      game.state.preferences.audience = { donations: command.donations, recruitment: command.recruitment };
      eventId = 'audience';
      break;
    case 'setJobPriority': {
      const job = game.state.jobs.find(item => item.id === command.jobId);
      if (job) job.priority = command.priority;
      eventId = command.jobId;
      break;
    }
  }
  return { ...quote, events: [{ tick: game.state.clock.tick, type: command.type, id: eventId, detail: 'Command applied' }] };
}
