import assert from 'node:assert/strict';
import test from 'node:test';
import { balance, createGame, definitions, deserializeGame, serializeGame, validateGame, ValidationError } from '../src/core/index.js';
import { canonicalStringify, getBalanceHash } from '../src/core/serialization.js';

test('new save provides fixture A with one founder and one founding telescope', () => {
  const { state } = createGame();
  assert.deepEqual(state.resources, { F: 25, K: 0, I: 0, X: 0, E: 0, C: 0 });
  assert.deepEqual(state.clock, { tick: 0, campaignStartTick: 0, campaignIndex: 1 });
  assert.deepEqual(state.population, { founder: { task: 'idle' }, groups: [] });
  assert.deepEqual(state.institution.instruments, [{ id: 'founding-telescope', definitionId: 'starter-refractor' }]);
  assert.deepEqual(state.lifetime.unlocked, ['backyard']);
  assert.ok(definitions.instruments.find(i => i.id === 'starter-refractor')?.tasks.includes('moon'));
  assert.equal(state.legacy.balance, 0);
});

test('new games do not share mutable state with each other or balance data', () => {
  const first = createGame();
  const second = createGame();
  first.state.resources.F = 0;
  first.state.institution.upgrades.outreach = 1;
  first.state.lifetime.journal.push('moon');
  assert.equal(second.state.resources.F, 25);
  assert.equal(balance.startingStocks.F, 25);
  assert.deepEqual(second.state.institution.upgrades, {});
  assert.deepEqual(second.state.lifetime.journal, []);
});

test('starter state round trip is lossless, canonical and independent', () => {
  const game = createGame();
  const saved = serializeGame(game);
  const restored = deserializeGame(saved);
  assert.deepEqual(restored, game);
  assert.equal(serializeGame(restored), saved);
  restored.state.resources.F = 0;
  assert.equal(game.state.resources.F, 25);
});

test('nonzero state and permanent/campaign upgrade levels survive round trip', () => {
  const game = createGame();
  game.state.clock.tick = 123;
  game.state.resources.K = 12.345678901;
  game.state.institution.upgrades.tracking = 1;
  game.state.campaign.upgrades['analysis-throughput'] = 3;
  game.state.lifetime.journal.push('moon');
  game.state.modified = true;
  assert.deepEqual(deserializeGame(serializeGame(game)), game);
});

test('serialization and validation leave source state unchanged', () => {
  const game = createGame();
  const before = structuredClone(game);
  validateGame(game);
  serializeGame(game);
  assert.deepEqual(game, before);
});

test('configuration fingerprint ignores key order but detects changed values', () => {
  const reordered = { startingLegacy: 0, startingStocks: { C: 0, E: 0, X: 0, I: 0, K: 0, F: 25 }, id: balance.id };
  assert.equal(getBalanceHash(reordered), getBalanceHash(balance));
  const changed = { ...balance, startingStocks: { ...balance.startingStocks, F: 26 } };
  assert.notEqual(getBalanceHash(changed), getBalanceHash(balance));
  assert.throws(() => deserializeGame(serializeGame(createGame()), definitions, changed), /balance configuration mismatch/);
  const changedGame = createGame(definitions, changed);
  assert.equal(changedGame.state.resources.F, 26);
  assert.deepEqual(deserializeGame(serializeGame(changedGame, definitions, changed), definitions, changed), changedGame);
});

test('save fingerprint also detects changed purchase costs under the same content version', () => {
  const changed = structuredClone(definitions);
  changed.upgrades[0].cost.base.F = 6;
  assert.notEqual(getBalanceHash(balance, changed), getBalanceHash(balance, definitions));
  assert.throws(() => deserializeGame(serializeGame(createGame()), changed), /balance configuration mismatch/);
});

/** @type {Array<[string, (game: import('../src/core/types.js').GameState) => void, RegExp]>} */
const invalidStates = [
  ['future schema', g => { g.schemaVersion = 999; }, /unsupported save schema/],
  ['old content', g => { g.contentVersion = 'old'; }, /content version mismatch/],
  ['wrong simulation', g => { g.simulationVersion = 'other'; }, /simulation version mismatch/],
  ['wrong balance ID', g => { g.balanceId = 'different'; }, /balance configuration mismatch/],
  ['negative stock', g => { g.state.resources.F = -1; }, /nonnegative/],
  ['nonfinite stock', g => { g.state.resources.K = Infinity; }, /nonnegative/],
  ['fractional time', g => { g.state.clock.tick = 0.25; }, /safe integer/],
  ['unsafe time', g => { g.state.clock.tick = Number.MAX_SAFE_INTEGER + 1; }, /safe integer/],
  ['future campaign start', g => { g.state.clock.campaignStartTick = 1; }, /after current tick/],
  ['zero campaign index', g => { g.state.clock.campaignIndex = 0; }, /numbering starts at one/],
  ['fractional publications', g => { g.state.campaign.publications = 0.5; }, /safe integer/],
  ['fractional Legacy', g => { g.state.legacy.balance = 0.5; }, /safe integer/],
  ['duplicate instruments', g => { g.state.institution.instruments.push({ ...g.state.institution.instruments[0] }); }, /duplicate instrument/],
  ['unknown instrument', g => { g.state.institution.instruments[0].definitionId = 'unknown'; }, /unknown instrument/],
  ['lost founder telescope', g => { g.state.institution.instruments = []; }, /founding telescope/],
  ['unknown upgrade', g => { g.state.institution.upgrades.unknown = 1; }, /unknown upgrade/],
  ['zero upgrade level', g => { g.state.institution.upgrades.tracking = 0; }, /out of bounds/],
  ['excess upgrade levels', g => { g.state.institution.upgrades.tracking = 2; }, /out of bounds/],
  ['incorrect persistence partition', g => { g.state.campaign.upgrades.tracking = 1; }, /incorrect persistence/],
  ['duplicate journal entries', g => { g.state.lifetime.journal = ['moon', 'moon']; }, /duplicate entry/],
  ['unknown journal entry', g => { g.state.lifetime.journal = ['unknown']; }, /unknown reference/],
  ['lost starter unlock', g => { g.state.lifetime.unlocked = []; }, /starter gate/],
];

for (const [name, corrupt, reason] of invalidStates) {
  test(`save rejects ${name}`, () => {
    const game = createGame();
    corrupt(game);
    assert.throws(() => validateGame(game), reason);
    assert.throws(() => deserializeGame(JSON.stringify(game)), ValidationError);
  });
}

test('failed load leaves the active save untouched', () => {
  let active = createGame();
  const previous = structuredClone(active);
  for (const json of ['{bad json', 'null', '[]', '{}',
    JSON.stringify({ ...active, unexpected: true }),
    JSON.stringify({ ...active, state: { ...active.state, resources: { ...active.state.resources, F: '25' } } }),
    JSON.stringify({ ...active, state: { ...active.state, jobs: [{ id: 'unsupported' }] } }),
    JSON.stringify({ ...active, state: { ...active.state, institution: { ...active.state.institution, upgrades: JSON.parse('{"__proto__":1}') } } }),
  ]) {
    assert.throws(() => { active = deserializeGame(json); }, ValidationError);
    assert.deepEqual(active, previous);
  }
  assert.equal(Object.hasOwn(Object.prototype, 'polluted'), false);
});

test('canonical JSON rejects values that ordinary JSON would silently lose', () => {
  const cyclic = { self: /** @type {unknown} */ (null) };
  cyclic.self = cyclic;
  for (const input of [NaN, Infinity, { value: undefined }, { value: () => 1 },
    [undefined], Array(1), cyclic, new Date(), { [Symbol('hidden')]: true }]) {
    assert.throws(() => canonicalStringify(input), ValidationError);
  }
  assert.equal(canonicalStringify({ z: 1, a: [2, 3] }), '{"a":[2,3],"z":1}');
});
