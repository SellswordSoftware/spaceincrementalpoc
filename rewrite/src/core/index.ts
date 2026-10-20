import { definitions } from "../definitions/content.ts";
import { balance } from "../definitions/balance.ts";
import { createEconomy } from "./economy.ts";
import { createSimulation } from "./simulation.ts";
import { createSummary } from "./summary.ts";
import { createSaves } from "./state.ts";
import { validateBalance } from "./validate.ts";
import type { Definitions, Balance } from "./types.ts";

export type * from "./types.ts";
export { definitions, balance };
export { TICK_SECONDS } from "./versions.ts";
export { ValidationError } from "./schema.ts";
export type Core = ReturnType<typeof createCore>;

// A core binds immutable configuration, never live game state. Multiple saves can share it.
export function createCore(content: Definitions = definitions, tuning: Balance = balance) {
  validateBalance(tuning);
  const economy = createEconomy(content, tuning);
  const simulation = createSimulation(economy);
  return {
    ...economy,
    ...simulation,
    ...createSummary(economy, simulation),
    ...createSaves(content, tuning),
  };
}

export const core = createCore();
