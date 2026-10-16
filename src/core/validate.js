import { persistenceClasses } from '../definitions/resources.js';
import { array, boolean, choice, dictionary, id, integer, nonnegative, object, record, requireValid, text } from './schema.js';
export { ValidationError } from './schema.js';

const resourceIds = /** @type {const} */ (['F', 'D', 'K', 'I', 'N', 'X', 'P', 'E', 'C', 'L']);
export const stockIds = /** @type {const} */ (['F', 'K', 'I', 'X', 'E', 'C']);
const prerequisites = array(id);
const cost = dictionary(choice(resourceIds), nonnegative);
/** @type {import('./schema.js').Rule} */
const gate = (value, path) => {
  record(value, path);
  const { autoUnlock, ...required } = value;
  object({ id, prerequisites })(required, path);
  if (Object.hasOwn(value, 'autoUnlock')) boolean(autoUnlock, `${path}.autoUnlock`);
};
const flows = dictionary(choice(stockIds), nonnegative);
/** @type {import('./schema.js').Rule} */
const workRequired = (value, path) => {
  if (value !== null) {
    nonnegative(value, path);
    requireValid(typeof value === 'number' && value > 0, path, 'completion work must be positive');
  }
};
const recipe = object({
  id, name: text, prerequisites, inputs: flows, outputs: flows, capacity: nonnegative,
  stat: choice([null, 'observing.capacity', 'analysis.capacity', 'outreach.capacity']),
  requiresFounder: boolean, compatibleInstruments: array(id), workRequired,
});
const resource = object({
  id: choice(resourceIds), name: text,
  kind: choice(['stock', 'typedInventory', 'population', 'achievement', 'legacy']),
  reset: choice(['reset', 'retain']), spendable: boolean, revealAt: id,
});
/** @type {import('./schema.js').Rule} */
const effect = (value, path) => {
  record(value, path);
  if (value.kind === 'multiply') {
    object({ kind: choice(['multiply']), stat: choice(['observing.capacity', 'analysis.capacity', 'outreach.capacity']), value: nonnegative })(value, path);
    requireValid(typeof value.value === 'number' && value.value >= 1, `${path}.value`, 'upgrade multiplier must be at least one');
  } else {
    object({ kind: choice(['unlock']), capability: choice(['outreach', 'tracking', 'imaging', 'fundedAnalysis']) })(value, path);
  }
};
const upgrade = object({
  id, name: text, persistence: choice(persistenceClasses), maxLevel: integer,
  revealPrerequisites: prerequisites, purchasePrerequisites: prerequisites,
  cost: object({ base: cost, growth: nonnegative }), effects: array(effect),
  panel: choice(['infrastructure', 'outreach', 'analysis', 'legacy']),
});
const definitionSchema = object({
  contentVersion: text, resources: array(resource), gates: array(gate), upgrades: array(upgrade), recipes: array(recipe),
  instruments: array(object({ id, name: text, tasks: array(id), purchasePrerequisites: prerequisites, cost })),
  targets: array(object({ id, name: text, fictional: boolean, dataType: id, requiredInstrument: id, sourceNote: text, permittedClaim: text })),
});

/** @param {unknown} input @returns {asserts input is import('./types.js').Definitions} */
export function validateDefinitions(input) {
  definitionSchema(input, 'definitions');
  // The schema above checks every field before typed graph/accounting checks.
  const definitions = /** @type {import('./types.js').Definitions} */ (input);
  const entries = [...definitions.resources, ...definitions.gates, ...definitions.upgrades, ...definitions.instruments, ...definitions.targets, ...definitions.recipes];
  const ids = new Set();
  for (const entry of entries) {
    requireValid(!ids.has(entry.id), entry.id, 'duplicate ID');
    ids.add(entry.id);
  }
  requireValid(definitions.resources.length === resourceIds.length, 'resources', 'all ten resource contracts are required');
  for (const item of definitions.resources) {
    const expectedKind = item.id === 'D' ? 'typedInventory' : item.id === 'N' ? 'population'
      : item.id === 'P' ? 'achievement' : item.id === 'L' ? 'legacy' : 'stock';
    requireValid(item.kind === expectedKind, item.id, 'incorrect resource kind');
    requireValid(item.reset === (item.id === 'N' || item.id === 'L' ? 'retain' : 'reset'), item.id, 'incorrect resource reset behavior');
    requireValid(item.spendable === ['F', 'K', 'X', 'E', 'C', 'L'].includes(item.id), item.id, 'incorrect spendable resource contract');
    requireValid(definitions.gates.some(g => g.id === item.revealAt) || definitions.upgrades.some(u => u.id === item.revealAt), item.id, 'missing reveal reference');
  }

  /** @type {Map<string, string[]>} */
  const dependencies = new Map();
  for (const item of definitions.gates) dependencies.set(item.id, item.prerequisites);
  for (const item of definitions.instruments) dependencies.set(item.id, item.purchasePrerequisites);
  for (const item of definitions.upgrades) dependencies.set(item.id, [...item.revealPrerequisites, ...item.purchasePrerequisites]);
  for (const [key, refs] of dependencies) {
    for (const ref of refs) requireValid(dependencies.has(ref), key, `missing prerequisite ${ref}`);
  }
  const visited = new Set();
  const visiting = new Set();
  /** @param {string} key */
  function visit(key) {
    requireValid(!visiting.has(key), key, 'prerequisite cycle');
    if (visited.has(key)) return;
    visiting.add(key);
    for (const ref of dependencies.get(key) ?? []) visit(ref);
    visiting.delete(key);
    visited.add(key);
  }
  for (const key of dependencies.keys()) visit(key);

  for (const item of definitions.recipes) {
    for (const ref of item.prerequisites) requireValid(dependencies.has(ref), item.id, `missing prerequisite ${ref}`);
    for (const ref of item.compatibleInstruments) requireValid(definitions.instruments.some(i => i.id === ref), item.id, `unknown compatible instrument ${ref}`);
  }

  const targets = new Set(definitions.targets.map(target => target.id));
  for (const instrument of definitions.instruments) {
    requireValid(new Set(instrument.tasks).size === instrument.tasks.length, instrument.id, 'duplicate task');
    for (const task of instrument.tasks) requireValid(targets.has(task), instrument.id, `missing target ${task}`);
    validateCosts(instrument.cost, definitions, instrument.id, false);
  }
  for (const target of definitions.targets) {
    requireValid(definitions.instruments.some(i => i.id === target.requiredInstrument && i.tasks.includes(target.id)), target.id, 'missing or incompatible required instrument');
  }
  for (const item of definitions.upgrades) {
    requireValid(item.maxLevel > 0 && item.maxLevel <= 1000, item.id, 'maxLevel must be 1–1000');
    requireValid(item.cost.growth >= 1, item.id, 'cost curve must be nondecreasing');
    requireValid(item.effects.length > 0, item.id, 'at least one supported effect is required');
    validateCosts(item.cost.base, definitions, item.id, item.persistence === 'legacy');
    requireValid(Object.keys(item.cost.base).length > 0, item.id, 'upgrade cost must not be empty');
    for (const amount of Object.values(item.cost.base)) {
      requireValid(Number.isFinite(amount * item.cost.growth ** (item.maxLevel - 1)), item.id, 'cost curve overflows');
    }
  }
  requireValid(definitions.gates.some(g => g.id === 'backyard' && g.prerequisites.length === 0), 'backyard', 'starter gate must exist without prerequisites');
  requireValid(definitions.instruments.some(i => i.id === 'starter-refractor' && i.tasks.includes('moon') && i.purchasePrerequisites.length === 0 && Object.keys(i.cost).length === 0), 'starter-refractor', 'free starter instrument required');
  requireValid(definitions.targets.some(t => t.id === 'moon' && t.requiredInstrument === 'starter-refractor'), 'moon', 'starter target required');
}

/** @param {Partial<Record<import('./types.js').ResourceId, number>>} costs @param {import('./types.js').Definitions} definitions @param {string} path @param {boolean} legacyOnly */
function validateCosts(costs, definitions, path, legacyOnly) {
  for (const key of Object.keys(costs)) {
    requireValid(definitions.resources.some(r => r.id === key && r.spendable), path, `${key} is not spendable`);
    requireValid(legacyOnly ? key === 'L' : key !== 'L', path, 'Legacy costs belong only to Legacy upgrades');
  }
}

/** @param {unknown} input @returns {asserts input is import('./types.js').Balance} */
export function validateBalance(input) {
  object({ id, startingStocks: object({ F: nonnegative, K: nonnegative, I: nonnegative, X: nonnegative, E: nonnegative, C: nonnegative }), startingLegacy: integer })(input, 'balance');
}
