import type { Balance, Definitions } from "./types.ts";
import { requireValid, nonnegative, integer } from "./schema.ts";
export { ValidationError } from "./schema.ts";
export function validateDefinitions(definitions: Definitions) {
  const ids = new Set();
  const known = new Set([
    ...definitions.investments.map((item) => item.id),
    "first-graduate",
    "first-publication",
  ]);
  for (const item of definitions.investments) {
    requireValid(!ids.has(item.id), "definitions", `duplicate purchase ${item.id}`);
    ids.add(item.id);
    requireValid(
      definitions.stations.some((station) => station.id === item.station),
      item.id,
      "unknown station",
    );
    requireValid(
      item.requires.every((id) => known.has(id)),
      item.id,
      "unknown prerequisite",
    );
    integer(item.maxLevel, item.id);
    nonnegative(item.growth, item.id);
    requireValid(item.growth >= 1, item.id, "prices cannot decrease");
    for (const cost of Object.values(item.cost)) nonnegative(cost, item.id);
    for (const value of Object.values(item.output)) nonnegative(value, item.id);
  }
  for (const upgrade of definitions.insightUpgrades) {
    requireValid(
      upgrade.factor > 1 && upgrade.growth >= 1,
      upgrade.id,
      "Insight boosts and cost growth must increase",
    );
    integer(upgrade.cost, upgrade.id);
    integer(upgrade.maxLevel, upgrade.id);
    requireValid(upgrade.cost > 0, upgrade.id, "Insight price must be positive");
  }
  for (const program of definitions.programs) {
    requireValid(
      program.requires.every((id) => known.has(id)),
      program.id,
      "unknown prerequisite",
    );
    requireValid(program.publicationsPerSecond > 0, program.id, "production must be positive");
  }
}
export function validateBalance(balance: Balance) {
  for (const value of Object.values(balance.startingStocks)) nonnegative(value, "startingStocks");
  requireValid(balance.course.seconds > 0, "course", "cycle seconds must be positive");
  integer(balance.prestige.baseAward, "prestige.baseAward");
  requireValid(balance.prestige.baseAward > 0, "prestige.baseAward", "must be positive");
  integer(balance.actionCooldownTicks, "actionCooldownTicks");
  requireValid(balance.actionCooldownTicks > 0, "actionCooldownTicks", "must be positive");
}
