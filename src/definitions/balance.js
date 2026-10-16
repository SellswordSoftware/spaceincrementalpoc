// Single-Data opening seeds. Costs replenish in 20 seconds at first passive I/F rates,
// allowing the first teacher to improve sustained recruitment as well as course speed.
/** @type {import('../core/types.js').Balance} */
export const balance = {
  id: 'insight-v1',
  startingStocks: { D: 0, F: 0, K: 0, I: 0, X: 0, E: 0, C: 0 },
  course: { cost: { F: 8, K: 3, I: 4 }, work: 40, baseRate: 1 },
  knowledgePerData: 0.2,
  actionCooldownTicks: 1,
  programRate: 1,
  prestige: {requires:['target-nebulae','observing-grant'],baseAward:4},
};
