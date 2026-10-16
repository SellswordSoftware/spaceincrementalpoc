import assert from 'node:assert/strict';
import test from 'node:test';
import { deserializeGame, definitions, serializeGame } from '../src/core/index.js';
import { runStarterScenario } from '../scenarios/starter.js';

test('starter commands recover from zero Funding and reach a processed camera image', () => {
  const { game, config, report } = runStarterScenario(5);
  assert.equal(report.fundingAfterOutreach, 0);
  assert.ok(report.fundingAfterRecoveryTick > 0);
  assert.ok(game.state.lifetime.unlocked.includes('image-record'));
  assert.ok(game.state.investigations.evidence.filter(item => item.targetId === 'lunar-image' && item.mode === 'camera').reduce((sum, item) => sum + item.quantity, 0) >= 100);
  assert.equal(game.state.institution.instruments.length, 2);
  assert.deepEqual(deserializeGame(serializeGame(game, definitions, config), definitions, config), game);
});
