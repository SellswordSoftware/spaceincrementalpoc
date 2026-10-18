import type { Balance } from "../core/types.ts";
// Permanent capacity purchases; timed producers have no recurring costs.
export const balance: Balance = {
  id: "pacing-v1",
  startingStocks: { D: 0, F: 0, K: 0, I: 0, X: 0, E: 0, C: 0 },
  course: { seconds: 40 },
  knowledgePerData: 0.2,
  actionCooldownTicks: 1,
  prestige: { requires: ["target-nebulae", "observing-grant", "robotic-dome"], baseAward: 5 },
};
