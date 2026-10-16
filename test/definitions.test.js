import assert from 'node:assert/strict';
import test from 'node:test';
import { balance, definitions, validateBalance, validateDefinitions, ValidationError } from '../src/core/index.js';

test('starter definitions and balance satisfy their contracts', () => {
  assert.doesNotThrow(() => validateDefinitions(definitions));
  assert.doesNotThrow(() => validateBalance(balance));
  assert.equal(definitions.resources.filter(r => r.kind === 'typedInventory').length, 1);
  assert.equal(definitions.resources.find(r => r.id === 'N')?.spendable, false);
});

/** @type {Array<[string, (d: import('../src/core/types.js').Definitions) => unknown, RegExp]>} */
const invalidDefinitions = [
  ['duplicate IDs across categories', d => ({ ...d, gates: [...d.gates, { id: 'moon', prerequisites: [] }] }), /duplicate ID/],
  ['missing prerequisite', d => ({ ...d, upgrades: [{ ...d.upgrades[0], purchasePrerequisites: ['absent'] }] }), /missing prerequisite/],
  ['missing reveal reference', d => ({ ...d, resources: d.resources.map(r => ({ ...r, revealAt: 'absent' })) }), /missing reveal reference/],
  ['cycle through reveal prerequisites', d => ({ ...d, upgrades: d.upgrades.map(u => u.id === 'outreach' ? { ...u, revealPrerequisites: ['outreach-milestone'] } : u) }), /prerequisite cycle/],
  ['unknown persistence class', d => ({ ...d, upgrades: d.upgrades.map(u => ({ ...u, persistence: 'temporary' })) }), /persistence/],
  ['unsupported effect kind', d => ({ ...d, upgrades: d.upgrades.map(u => ({ ...u, effects: [{ kind: 'execute', code: 'arbitrary code' }] })) }), /effects/],
  ['unsupported effect stat', d => ({ ...d, upgrades: d.upgrades.map(u => ({ ...u, effects: [{ kind: 'multiply', stat: 'unknown', value: 2 }] })) }), /stat/],
  ['nonfinite cost', d => ({ ...d, upgrades: d.upgrades.map(u => ({ ...u, cost: { base: { F: Infinity }, growth: 1 } })) }), /nonnegative/],
  ['negative cost', d => ({ ...d, upgrades: d.upgrades.map(u => ({ ...u, cost: { base: { F: -1 }, growth: 1 } })) }), /nonnegative/],
  ['decreasing cost curve', d => ({ ...d, upgrades: d.upgrades.map(u => ({ ...u, cost: { ...u.cost, growth: 0.9 } })) }), /nondecreasing/],
  ['overflowing cost curve', d => ({ ...d, upgrades: d.upgrades.map(u => ({ ...u, maxLevel: 1000, cost: { base: { F: 100 }, growth: 100 } })) }), /overflows/],
  ['non-spendable cost', d => ({ ...d, upgrades: d.upgrades.map(u => ({ ...u, cost: { base: { N: 1 }, growth: 1 } })) }), /not spendable/],
  ['Legacy on ordinary purchase', d => ({ ...d, upgrades: d.upgrades.map(u => ({ ...u, cost: { base: { L: 1 }, growth: 1 } })) }), /Legacy costs/],
  ['wrong resource persistence', d => ({ ...d, resources: d.resources.map(r => r.id === 'N' ? { ...r, reset: 'reset' } : r) }), /reset behavior/],
  ['missing required instrument', d => ({ ...d, targets: d.targets.map(t => ({ ...t, requiredInstrument: 'absent' })) }), /required instrument/],
  ['unknown target', d => ({ ...d, instruments: d.instruments.map(i => ({ ...i, tasks: ['absent'] })) }), /missing target/],
  ['fractional max level', d => ({ ...d, upgrades: d.upgrades.map(u => ({ ...u, maxLevel: 1.5 })) }), /safe integer/],
  ['unknown fields', d => ({ ...d, script: 'unexpected' }), /unknown field/],
];

for (const [name, corrupt, reason] of invalidDefinitions) {
  test(`definitions reject ${name}`, () => {
    assert.throws(() => validateDefinitions(corrupt(structuredClone(definitions))), error => {
      assert.ok(error instanceof ValidationError);
      assert.match(error.message, reason);
      return true;
    });
  });
}

test('balance rejects missing, extra, negative and nonfinite stocks', () => {
  for (const startingStocks of [
    { F: 25 }, { ...balance.startingStocks, D: 5 },
    { ...balance.startingStocks, F: -1 }, { ...balance.startingStocks, K: NaN },
  ]) {
    assert.throws(() => validateBalance({ ...balance, startingStocks }), ValidationError);
  }
});

test('reveal and purchase prerequisites remain distinct definitions', () => {
  const copy = structuredClone(definitions);
  copy.upgrades[0].revealPrerequisites = ['backyard'];
  assert.doesNotThrow(() => validateDefinitions(copy));
  assert.deepEqual(copy.upgrades[0].purchasePrerequisites, ['lunar-record']);
});
