import type { Definitions, Balance, GameState, State } from "./types.ts";
import { createEconomy } from "./economy.ts";
import { definitions as bundledDefinitions } from "../definitions/content.ts";
import { balance as bundledBalance } from "../definitions/balance.ts";
import { SAVE_SCHEMA_VERSION, SIMULATION_VERSION } from "./versions.ts";
import { getBalanceHash } from "./serialization.ts";

// Only these exact historical configurations can be translated into the bundled economy.
const versions = [
  [6, "0.7.0-single-data", "4f42765e"],
  [7, "0.8.0-programs", "dc9d1e78"],
  [8, "0.9.0-insight", "a0c29bc6"],
  [9, "0.10.0-parallel", "bef188b1"],
  [10, "0.11.0-engineering", "aeaacb8c"],
  [11, "0.12.0-horizons", "575bb458"],
  [12, "0.13.0-synthesis", "7c876725"],
  [13, "0.14.0-progression", "7b4ab164"],
  [14, "0.15.0-production", "66e896fc"],
] as const;
type LegacyGame = Omit<GameState, "state"> & {
  state: Omit<State, "science" | "joint"> & {
    course?: { progress: number };
    science: {
      publications: number;
      remainder?: number;
      timers?: number[];
      program?: { progress: number } | null;
    };
    missions?: Record<string, { progress: number; remainder: number }>;
    joint: {
      completedAtTick: number | null;
      programs?: Record<
        string,
        { progress: number; remainder: number; publicationRemainder: number }
      >;
    };
  };
};

export function migrate(
  candidate: Record<string, unknown>,
  definitions: Definitions,
  balance: Balance,
) {
  const version = versions.find(
    ([schema, version, hash]) =>
      candidate.schemaVersion === schema &&
      candidate.contentVersion === version &&
      candidate.simulationVersion === version &&
      candidate.balanceId === `${version.split("-").slice(1).join("-")}-v1` &&
      candidate.balanceHash === `fnv1a32-${hash}`,
  );
  if (!version || definitions !== bundledDefinitions || balance !== bundledBalance) return;
  const schema = version[0];
  // The imported legacy shape is converted here, then fully validated before returning to callers.
  const game = candidate as unknown as LegacyGame;
  const old = game.state;
  if (schema < 14) {
    if (schema < 12) old.joint = { programs: {}, completedAtTick: null };
    if (schema < 11) old.missions = {};
    if (schema === 6) old.science = { publications: 0, program: null };
    if (schema < 8)
      old.insight = { points: 0, totalEarned: 0, upgrades: {}, phase: "playing", lastAward: 0 };
    if (schema < 9) {
      const classrooms = old.purchases.academy ? 1 + (old.purchases["appoint-teacher"] ?? 0) : 0;
      const teams = old.purchases.photometry ? 1 + (old.purchases["appoint-scientist"] ?? 0) : 0;
      old.academy = {
        timers: Array.from({ length: classrooms }, (_, i) =>
          i === 0 ? Math.min(old.course?.progress ?? 0, 39.75) : 0,
        ),
        remainder: 0,
      };
      old.science = {
        publications: old.science.publications,
        timers: Array.from({ length: teams }, (_, i) =>
          i === 0 ? Math.min(old.science.program?.progress ?? 0, 59.75) : 0,
        ),
        remainder: 0,
      };
      delete old.course;
    }
    const { multiplier } = createEconomy(definitions, balance);
    const scienceFactor = multiplier(game as GameState, "science");
    const creditFactor = multiplier(game as GameState, "collaboration");
    let publications = old.science.publications + (old.science.remainder ?? 0);
    for (const progress of old.science.timers ?? [])
      publications += (progress / 60) * scienceFactor;
    for (const [id, mission] of Object.entries(old.missions ?? {}))
      publications +=
        mission.remainder + (mission.progress / 60) * (id === "infrared" ? 2 : 1) * scienceFactor;
    for (const [id, program] of Object.entries(old.joint.programs ?? {})) {
      const index = ["changing-sky", "planetary-systems", "deep-time"].indexOf(id);
      publications +=
        program.publicationRemainder + (program.progress / 60) * (index + 2) * scienceFactor;
      old.resources.C += program.remainder + (program.progress / 60) * (index + 1) * creditFactor;
    }
    old.population.total += Object.keys(old.joint.programs ?? {}).length;
    old.science = { publications };
    old.reviewedOptions = Object.keys(old.purchases).filter((id) => old.purchases[id] > 0);
    old.joint = {
      completedAtTick:
        old.joint.completedAtTick ?? (old.purchases["network-synthesis"] ? old.clock.tick : null),
    };
    delete old.missions;
  }
  Object.assign(game, {
    schemaVersion: SAVE_SCHEMA_VERSION,
    contentVersion: definitions.contentVersion,
    balanceId: balance.id,
    balanceHash: getBalanceHash(balance, definitions),
    simulationVersion: SIMULATION_VERSION,
  });
}
