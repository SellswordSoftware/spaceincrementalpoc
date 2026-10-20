import { event } from "./events.ts";
import { catalog } from "../definitions/catalog.ts";
import type {
  Balance,
  Definitions,
  GameEvent,
  GameState as Game,
  Output,
  StatId,
} from "./types.ts";
export type Economy = ReturnType<typeof createEconomy>;
export function createEconomy(definitions: Definitions, balance: Balance) {
  const data = catalog(definitions);
  function getPurchaseCount(game: Game, id: string) {
    return game.state.purchases[id] ?? 0;
  }
  function hasPrerequisite(game: Game, id: string) {
    if (id === "first-publication") return game.state.science.publications + 1e-9 >= 1;
    return id === "first-graduate"
      ? game.state.population.total > 0
      : getPurchaseCount(game, id) > 0;
  }
  const milestoneNames: Record<string, string> = {
    "first-graduate": "first graduate",
    "first-publication": "first Publication",
  };
  function prerequisiteName(id: string) {
    return data.investments.get(id)?.name ?? milestoneNames[id] ?? id;
  }
  function insightMultiplier(game: Game, stat: StatId) {
    let factor = 1;
    for (const item of definitions.insightUpgrades) {
      if (item.stats.includes(stat))
        factor *=
          (item.factors?.[stat] ?? item.factor) ** (game.state.insight.upgrades[item.id] ?? 0);
    }
    return factor;
  }
  function multiplier(game: Game, stat: StatId) {
    let bonus = 0;
    for (const item of data.boosts) {
      if (item.boost?.stat === stat) bonus += item.boost.bonus * getPurchaseCount(game, item.id);
    }
    return insightMultiplier(game, stat) * (1 + bonus);
  }
  function observingFrontier(game: Game) {
    return definitions.targets
      .filter((target) => !target.investmentId || hasPrerequisite(game, target.investmentId))
      .reduce(
        (best, target) => (target.yield > best.yield ? target : best),
        definitions.targets[0],
      );
  }
  const outputStats: Record<keyof Output, StatId> = {
    D: "observing",
    K: "analysis",
    I: "outreach",
    F: "support",
    X: "research",
    E: "engineering",
    C: "collaboration",
    training: "teaching",
    science: "science",
  };
  const outputStat = (output: string): StatId => outputStats[output as keyof Output];
  function outputMultiplier(game: Game, output: string) {
    return (
      multiplier(game, outputStat(output)) * (output === "D" ? observingFrontier(game).yield : 1)
    );
  }
  function scaledOutput(game: Game, base: Output): Output {
    return Object.fromEntries(
      Object.entries(base).map(([key, value]) => [key, value * outputMultiplier(game, key)]),
    );
  }
  function analysisYield(game: Game) {
    // Frontier and observing Insight already increase raw Data volume. Normalize those
    // gains here; analysis capacity and its Insight determine the Knowledge reward.
    return (
      (balance.knowledgePerData * multiplier(game, "analysis")) /
      (observingFrontier(game).yield * insightMultiplier(game, "observing"))
    );
  }
  function baseProduction(game: Game): Output {
    const output: Output = {};
    if (hasPrerequisite(game, "photometry"))
      output.science =
        (1 + getPurchaseCount(game, "appoint-scientist")) *
        definitions.programs[0].publicationsPerSecond;
    for (const mission of definitions.missions)
      if (hasPrerequisite(game, mission.commissionId))
        output.science = (output.science ?? 0) + mission.publicationsPerSecond;
    for (const program of definitions.jointPrograms)
      if (hasPrerequisite(game, program.investmentId)) {
        output.C =
          (output.C ?? 0) + program.creditsPerSecond * getPurchaseCount(game, program.investmentId);
        output.science =
          (output.science ?? 0) +
          program.publicationsPerSecond * getPurchaseCount(game, program.investmentId);
      }
    if (hasPrerequisite(game, "academy"))
      output.training = (1 + getPurchaseCount(game, "appoint-teacher")) / balance.course.seconds;
    for (const item of definitions.investments)
      for (const [key, value] of Object.entries(item.output)) {
        const currency = key as keyof Output;
        output[currency] = (output[currency] ?? 0) + value * getPurchaseCount(game, item.id);
      }
    return output;
  }
  function productionRates(game: Game) {
    return scaledOutput(game, baseProduction(game));
  }
  function actionOutput(game: Game, actionId: string): Output {
    const action = data.actions.get(actionId);
    if (!action) return {};
    const minimum = scaledOutput(game, action.output),
      rates = productionRates(game);
    return Object.fromEntries(
      Object.entries(minimum).map(([key, amount]) => [
        key,
        Math.max(amount, (rates[key as keyof Output] ?? 0) * balance.assistanceSeconds),
      ]),
    );
  }
  function previewInvestment(game: Game, investmentId: string) {
    const candidate = {
      ...game,
      state: {
        ...game.state,
        purchases: {
          ...game.state.purchases,
          [investmentId]: getPurchaseCount(game, investmentId) + 1,
        },
      },
    };
    const before = productionRates(game),
      after = productionRates(candidate);
    const passive: Output = {};
    for (const key of Object.keys(after)) {
      const currency = key as keyof Output;
      const gain = (after[currency] ?? 0) - (before[currency] ?? 0);
      if (gain > 1e-9) passive[currency] = gain;
    }
    // Discoveries improve observing; practice improvements can affect a different station.
    const item = data.investments.get(investmentId);
    const stat = item?.boost?.stat;
    const relevantAction = data.discoveries.has(investmentId)
      ? data.actions.get("observe")
      : definitions.actions.find((action) =>
          stat
            ? Object.keys(action.output).some((key) => outputStat(key) === stat)
            : action.station === item?.station,
        );
    let activeGain = 0;
    if (relevantAction) {
      const key = Object.keys(relevantAction.output)[0] as keyof Output;
      activeGain =
        (actionOutput(candidate, relevantAction.id)[key] ?? 0) -
        (actionOutput(game, relevantAction.id)[key] ?? 0);
    }
    return {
      passive,
      actionName: relevantAction?.name ?? "",
      activeGain,
      analysisGain: 10 * (analysisYield(candidate) - analysisYield(game)),
    };
  }
  function facilitySummary(game: Game) {
    const facilities = definitions.facilities.map((facility) => ({
      ...facility,
      built: !facility.id || hasPrerequisite(game, facility.id),
    }));
    const built = facilities.filter((facility) => facility.built);
    return {
      facilities,
      current: built[built.length - 1],
      telescopes:
        1 +
        ["additional-telescope", "reflector", "radio-dish"].reduce(
          (sum, id) => sum + getPurchaseCount(game, id),
          0,
        ) +
        built.reduce((sum, facility) => sum + facility.telescopes, 0),
    };
  }
  function availableInvestments(game: Game) {
    if (game.state.insight.phase === "shop") return [];
    return definitions.investments.filter(
      (item) =>
        item.requires.every((id) => hasPrerequisite(game, id)) &&
        game.state.science.publications + 1e-9 >= (item.publications ?? 0) &&
        getPurchaseCount(game, item.id) < item.maxLevel,
    );
  }
  function newOptions(game: Game) {
    return availableInvestments(game).filter(
      (item) => !getPurchaseCount(game, item.id) && !game.state.reviewedOptions.includes(item.id),
    );
  }
  function unlockEvents(before: string[], game: Game, source?: string): GameEvent[] {
    return availableInvestments(game)
      .filter((item) => !before.includes(item.id) && !getPurchaseCount(game, item.id))
      .map((item) =>
        event(
          game.state.clock.tick,
          "unlock",
          item.id,
          `${source ? source + " unlocked" : "Now available:"} ${item.name} in ${data.stations.get(item.station)?.name}.`,
        ),
      );
  }
  function grantCount(game: Game) {
    return data.grants.reduce((total, item) => total + getPurchaseCount(game, item.id), 0);
  }
  function populationSummary(game: Game) {
    const appointed = data.appointments.reduce(
      (sum, item) => sum + (game.state.purchases[item.id] ?? 0),
      0,
    );
    return {
      total: game.state.population.total,
      appointed,
      available: game.state.population.total - appointed,
    };
  }
  return {
    definitions,
    balance,
    getPurchaseCount,
    hasPrerequisite,
    prerequisiteName,
    insightMultiplier,
    multiplier,
    observingFrontier,
    outputStat,
    outputMultiplier,
    scaledOutput,
    analysisYield,
    actionOutput,
    baseProduction,
    productionRates,
    previewInvestment,
    facilitySummary,
    availableInvestments,
    newOptions,
    unlockEvents,
    grantCount,
    populationSummary,
  };
}
