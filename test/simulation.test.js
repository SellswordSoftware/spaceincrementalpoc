import assert from 'node:assert/strict';
import test from 'node:test';
import { advanceTicks, balance, createGame, definitions, deserializeGame, dispatch, getSummary, quoteCommand, serializeGame } from '../src/core/index.js';

// One kernel smoke scenario: stock recipes are fixtures, not astronomy content.
test('tick reservations, atomic purchase, and chunked continuation agree', () => {
  const content = structuredClone(definitions);
  const config = { ...balance, startingStocks: { F: 0, K: 0, I: 0, X: 0, E: 0, C: 0 } };
  /** @type {import('../src/core/types.js').RecipeDefinition} */
  const recipe = { id: 'supply', name: 'Supply fixture', prerequisites: [], inputs: {}, outputs: { F: 4, K: 4 }, capacity: 1, stat: null, requiresFounder: false, compatibleInstruments: [], workRequired: null };
  content.recipes.push(recipe,
    { ...recipe, id: 'consumer-a', inputs: { F: 4 }, outputs: { X: 4 }, workRequired: 0.5 },
    { ...recipe, id: 'consumer-b', inputs: { F: 4 }, outputs: { C: 4 } });
  const game = createGame(content, config);
  assert.ok(dispatch(game, content, config, { type: 'setJobAllocation', jobId: 'supply', recipeId: 'supply', allocation: 1 }).ok);
  advanceTicks(game, content, config, 1);
  /** @type {import('../src/core/types.js').Command} */
  const purchase = { type: 'buyUpgrade', upgradeId: 'outreach' };
  const before = serializeGame(game, content, config);
  assert.equal(quoteCommand(game, content, config, purchase).ok, false);
  assert.equal(dispatch(game, content, config, purchase).ok, false);
  assert.equal(serializeGame(game, content, config), before); // No partial charge.
  advanceTicks(game, content, config, 4);
  // The fixture bypasses only the science prerequisite, not command validation.
  game.state.lifetime.unlocked.push('lunar-record');
  assert.ok(dispatch(game, content, config, purchase).ok);
  assert.equal(game.state.resources.F, 0);
  assert.equal(game.state.resources.K, 4);
  assert.equal(game.state.institution.upgrades.outreach, 1);
  const paid = serializeGame(game, content, config);
  assert.equal(dispatch(game, content, config, purchase).ok, false);
  assert.equal(serializeGame(game, content, config), paid); // Charged exactly once.

  for (const jobId of ['consumer-a', 'consumer-b']) {
    assert.ok(dispatch(game, content, config, { type: 'setJobAllocation', jobId, recipeId: jobId, allocation: 1 }).ok);
  }
  // Higher priority overrides ID order; the second consumer gets the scarce F.
  assert.ok(dispatch(game, content, config, { type: 'setJobPriority', jobId: 'consumer-b', priority: 1 }).ok);
  const split = deserializeGame(serializeGame(game, content, config), content, config);
  const tick = game.state.clock.tick;
  /** @type {{tick: number, sequence: number, command: import('../src/core/types.js').Command}[]} */
  const schedule = [{ tick: tick + 2, sequence: 0, command: { type: 'setJobPriority', jobId: 'consumer-a', priority: 2 } }];
  const whole = advanceTicks(game, content, config, 5, schedule);
  advanceTicks(split, content, config, 1, schedule);
  assert.equal(split.state.resources.C, 0); // New supply cannot be consumed this tick.
  advanceTicks(split, content, config, 1, schedule);
  assert.equal(split.state.resources.C, 1);
  assert.equal(split.state.resources.X, 0); // Shared F reserved only once.
  const restored = deserializeGame(serializeGame(split, content, config), content, config);
  advanceTicks(restored, content, config, 3, schedule);
  assert.deepEqual(restored, game);
  assert.equal(whole.events.filter(event => event.type === 'jobCompleted').length, 1);
  assert.equal(game.state.resources.X, 2);
  assert.equal(game.state.resources.C, 2);
  assert.equal(whole.acceptedCommands.length, 1);
  assert.ok(getSummary(game, content, config).jobs.some(job => job.blockedReasons.includes('Completed')));
});
