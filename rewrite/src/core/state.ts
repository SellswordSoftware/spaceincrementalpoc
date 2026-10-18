import { migrate } from "./migrations.ts";
import { record } from "./schema.ts";
import type { Balance, Definitions, GameState as Game, InsightState, State } from "./types.ts";

import { canonicalStringify, getBalanceHash } from "./serialization.ts";
import { ValidationError } from "./schema.ts";
import { validateGame } from "./validate-state.ts";
import { SAVE_SCHEMA_VERSION, SIMULATION_VERSION } from "./versions.ts";
export function createRunState(
  balance: Balance,
  campaignIndex: number = 1,
  insight: InsightState = {
    points: 0,
    totalEarned: 0,
    upgrades: {},
    phase: "playing",
    lastAward: 0,
  },
): State {
  return {
    clock: { tick: 0, campaignIndex },
    insight,
    resources: { ...balance.startingStocks },
    purchases: {},
    population: { total: 0 },
    academy: { timers: [], remainder: 0 },
    science: { publications: 0 },
    reviewedOptions: [],
    joint: { completedAtTick: null },
    journal: ["moon"],
    nextActionTick: 0,
    modified: false,
  };
}
export function createSaves(definitions: Definitions, balance: Balance) {
  const metadata = {
    schemaVersion: SAVE_SCHEMA_VERSION,
    contentVersion: definitions.contentVersion,
    balanceId: balance.id,
    balanceHash: getBalanceHash(balance, definitions),
    simulationVersion: SIMULATION_VERSION,
  };
  function createGame(): Game {
    return { ...metadata, state: createRunState(balance) };
  }
  function serializeGame(game: Game) {
    validateGame(game, definitions, balance);
    return canonicalStringify(game);
  }
  function deserializeGame(json: string): Game {
    let candidate: unknown;
    try {
      candidate = JSON.parse(json);
    } catch {
      throw new ValidationError("save", "invalid JSON");
    }
    record(candidate, "save");
    migrate(candidate, definitions, balance);
    validateGame(candidate, definitions, balance);
    return candidate;
  }
  return {
    createGame,
    serializeGame,
    deserializeGame,
    validateGame: (game: unknown) => validateGame(game, definitions, balance),
  };
}
