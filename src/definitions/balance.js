// Permanent capacity purchases; timed producers have no recurring costs.
/** @type {import('../core/types.js').Balance} */
export const balance = {
  id: 'progression-v1',
  startingStocks: { D: 0, F: 0, K: 0, I: 0, X: 0, E: 0, C: 0 },
  course: { seconds: 40 },
  knowledgePerData: 0.2,
  actionCooldownTicks: 1,
  prestige: {requires:['target-nebulae','observing-grant'],baseAward:4},
};
