import { catalog } from "../definitions/catalog.ts";
import { createEconomy } from "./economy.ts";
import type { Balance, Definitions, GameState as Game } from "./types.ts";
import {
  object,
  dictionary,
  array,
  integer,
  nonnegative,
  text,
  id,
  choice,
  boolean,
  requireValid,
  nullable,
} from "./schema.ts";
import { createRunState } from "./state.ts";
import { canonicalStringify, getBalanceHash } from "./serialization.ts";
import { SAVE_SCHEMA_VERSION, SIMULATION_VERSION } from "./versions.ts";

const target = choice([
  "moon",
  "jupiter",
  "saturn",
  "star-clusters",
  "nebulae",
  "galaxies",
  "galaxy-clusters",
  "radio-sources",
  "transit-targets",
  "infrared-fields",
  "deep-field",
]);
const stocks = object({
  D: nonnegative,
  F: nonnegative,
  K: nonnegative,
  I: nonnegative,
  X: nonnegative,
  E: nonnegative,
  C: nonnegative,
});
const state = object({
  clock: object({ tick: integer, campaignIndex: integer }),
  resources: stocks,
  insight: object({
    points: integer,
    totalEarned: integer,
    upgrades: dictionary(id, integer),
    phase: choice(["playing", "shop"]),
    lastAward: integer,
  }),
  purchases: dictionary(id, integer),
  population: object({ total: integer }),
  academy: object({ timers: array(nonnegative), remainder: nonnegative }),
  science: object({ publications: nonnegative }),
  reviewedOptions: array(id),
  joint: object({ completedAtTick: nullable(integer) }),
  journal: array(target),
  nextActionTick: integer,
  modified: boolean,
});
const envelope = object({
  schemaVersion: integer,
  contentVersion: text,
  balanceId: text,
  balanceHash: text,
  simulationVersion: text,
  state,
});
export function validateGame(
  value: unknown,
  definitions: Definitions,
  balance: Balance,
): asserts value is Game {
  const game = envelope(value, "save");
  const state = game.state;
  const data = catalog(definitions);
  const { grantCount, populationSummary } = createEconomy(definitions, balance);
  requireValid(
    game.schemaVersion === SAVE_SCHEMA_VERSION,
    "save",
    "This save uses a previous economy. Export it and start a new station prototype.",
  );
  requireValid(
    game.contentVersion === definitions.contentVersion &&
      game.simulationVersion === SIMULATION_VERSION,
    "save",
    "incompatible content or simulation version",
  );
  requireValid(
    game.balanceId === balance.id && game.balanceHash === getBalanceHash(balance, definitions),
    "save",
    "configuration mismatch",
  );
  let insightSpent = 0;
  for (const [key, count] of Object.entries(state.insight.upgrades)) {
    const upgrade = data.insightUpgrades.get(key);
    requireValid(
      upgrade && count <= upgrade.maxLevel,
      "insight",
      `unknown or excessive upgrade ${key}`,
    );
    for (let level = 0; level < count; level++)
      insightSpent += Math.ceil(upgrade.cost * upgrade.growth ** level);
  }
  for (const [key, count] of Object.entries(state.purchases)) {
    const item = data.investments.get(key);
    requireValid(
      item && count <= item.maxLevel,
      "purchases",
      `unknown or excessive purchase ${key}`,
    );
  }
  if (state.insight.phase === "shop") {
    const reset = {
      ...createRunState(balance, state.clock.campaignIndex, state.insight),
      modified: state.modified,
    };
    requireValid(
      canonicalStringify(state) === canonicalStringify(reset),
      "prestige",
      "between-run state must have reset ordinary progress",
    );
  }
  const academy = state.academy;
  const classrooms = state.purchases.academy ? 1 + (state.purchases["appoint-teacher"] ?? 0) : 0;
  const completed = state.joint.completedAtTick;
  const checks: [unknown, string, string][] = [
    [
      state.insight.points + insightSpent === state.insight.totalEarned,
      "insight",
      "earned points must match spent and available Insight",
    ],
    [
      state.insight.lastAward <= state.insight.totalEarned,
      "insight",
      "last award exceeds total earned",
    ],
    [state.clock.campaignIndex >= 1, "run", "run number must be positive"],
    [populationSummary(game).available >= 0, "population", "appointments exceed graduates"],
    [
      academy.timers.length === classrooms &&
        academy.timers.every((time) => time < balance.course.seconds),
      "academy",
      "timer count or cycle progress mismatch",
    ],
    [
      academy.remainder < 1 && (classrooms > 0 || academy.remainder === 0),
      "academy",
      "invalid fractional reward",
    ],
    [
      state.reviewedOptions.every((id) => data.investments.has(id)),
      "reviewedOptions",
      "unknown option",
    ],
    [
      Boolean(state.purchases[definitions.finale.investmentId]) === (completed !== null),
      "finale",
      "purchase and completion must agree",
    ],
    [completed === null || completed <= state.clock.tick, "finale", "completion is in the future"],
    [
      grantCount(game) <= Math.floor(state.science.publications + 1e-9),
      "grants",
      "grants exceed Publications",
    ],
  ];
  for (const [condition, path, reason] of checks) requireValid(condition, path, reason);
}

export type SaveData = import("./schema.ts").Infer<typeof envelope>;
