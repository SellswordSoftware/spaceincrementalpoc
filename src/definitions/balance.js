// Seed fixture A, not measured game balance. Rates and recipes arrive in P3.
/** @type {import('../core/types.js').Balance} */
export const balance = {
  id: 'starter-v1',
  startingStocks: { F: 25, K: 0, I: 0, X: 0, E: 0, C: 0 },
  startingLegacy: 0,
};

// Purchase/effect seeds are assembled into definitions, which are also fingerprinted
// in saves. They describe effects; executing purchases/effects starts in P2/P3.
/** @type {Record<string, Pick<import('../core/types.js').UpgradeDefinition, 'maxLevel'|'cost'|'effects'>>} */
export const upgradeTuning = {
  outreach: { maxLevel: 1, cost: { base: { F: 5, K: 1 }, growth: 1 }, effects: [{ kind: 'unlock', capability: 'outreach' }] },
  'stable-mount': { maxLevel: 1, cost: { base: { F: 15 }, growth: 1 }, effects: [{ kind: 'multiply', stat: 'observing.capacity', value: 1.2 }] },
  tracking: { maxLevel: 1, cost: { base: { F: 30, K: 5 }, growth: 1 }, effects: [{ kind: 'unlock', capability: 'tracking' }] },
  camera: { maxLevel: 1, cost: { base: { F: 75, K: 10 }, growth: 1 }, effects: [{ kind: 'unlock', capability: 'imaging' }] },
  workstation: { maxLevel: 1, cost: { base: { F: 50, K: 5 }, growth: 1 }, effects: [{ kind: 'unlock', capability: 'fundedAnalysis' }] },
  'analysis-throughput': { maxLevel: 5, cost: { base: { F: 20, K: 5 }, growth: 1.5 }, effects: [{ kind: 'multiply', stat: 'analysis.capacity', value: 1.25 }] },
};

/** @type {Record<string, Partial<Record<import('../core/types.js').ResourceId, number>>>} */
export const instrumentCosts = { 'starter-refractor': {}, reflector: { F: 100 } };
