import { catalog } from "../definitions/catalog.ts";
import type {
  Command,
  CommandQuote,
  CommandResult,
  Costs,
  CurrencyId,
  GameEvent,
  GameState as Game,
  Output,
  StockId,
  InsightUpgrade,
} from "./types.ts";
import type { Economy } from "./economy.ts";
import { event } from "./events.ts";

import { TICK_SECONDS } from "./versions.ts";

import { createRunState } from "./state.ts";
export type Simulation = ReturnType<typeof createSimulation>;
export function createSimulation(economy: Economy) {
  const {
    definitions,
    balance,
    getPurchaseCount,
    hasPrerequisite,
    prerequisiteName,
    multiplier,
    actionOutput,
    analysisYield,
    productionRates,
    facilitySummary,
    availableInvestments,
    unlockEvents,
    grantCount,
    populationSummary,
  } = economy;
  const data = catalog(definitions);
  function wallet(game: Game, key: string) {
    if (key === "Insight") return game.state.insight.points;
    if (key === "N") return populationSummary(game).available;
    return game.state.resources[key as StockId] ?? 0;
  }
  function quoteCommand(game: Game, command: Command): CommandQuote {
    const state = game.state;
    let costs: Costs = {};
    const blockedReasons: string[] = [];
    const block = (condition: boolean, reason: string) => {
      if (condition) blockedReasons.push(reason);
    };
    const require = (ids: string[]) => {
      for (const id of ids) block(!hasPrerequisite(game, id), `Requires ${prerequisiteName(id)}`);
    };
    const transition = ["beginPrestige", "buyInsightUpgrade", "startNextRun"].includes(
      command.type,
    );
    block(
      !transition && state.insight.phase === "shop",
      "Begin the next run before using stations",
    );
    switch (command.type) {
      case "reviewOption":
        block(
          !availableInvestments(game).some((item) => item.id === command.investmentId),
          "Option is not available",
        );
        break;
      case "beginPrestige":
        blockedReasons.push(...previewPrestige(game).blockedReasons);
        break;
      case "buyInsightUpgrade": {
        block(state.insight.phase !== "shop", "Insight upgrades are bought between runs");
        const upgrade = data.insightUpgrades.get(command.upgradeId);
        if (!upgrade) {
          blockedReasons.push("Unknown Insight upgrade");
          break;
        }
        block((state.insight.upgrades[upgrade.id] ?? 0) >= upgrade.maxLevel, "Fully purchased");
        costs = { Insight: insightPrice(game, upgrade) };
        break;
      }
      case "startNextRun":
        block(state.insight.phase !== "shop", "No new run is waiting to begin");
        break;
      case "buyInvestment": {
        const item = data.investments.get(command.investmentId);
        if (!item) {
          blockedReasons.push("Unknown purchase");
          break;
        }
        const count = getPurchaseCount(game, item.id);
        require(item.requires);
        block(
          state.science.publications + 1e-9 < (item.publications ?? 0),
          `Requires ${item.publications} cumulative Publications (not spent)`,
        );
        block(
          Boolean(item.grant) && grantCount(game) >= Math.floor(state.science.publications + 1e-9),
          "Publish another study to open another grant slot",
        );
        block(count >= item.maxLevel, "Fully purchased");
        for (const [key, base] of Object.entries(item.cost)) {
          const precision = key === "X" ? 100 : 1;
          costs[key as CurrencyId] =
            Math.ceil(base * (key === "N" ? 1 : item.growth ** count) * precision - 1e-9) /
            precision;
        }
        break;
      }
      case "processData":
        require(["analysis-tools"]);
        if (!Number.isFinite(command.quantity) || command.quantity <= 0)
          blockedReasons.push("No Data to process");
        else costs.D = command.quantity;
        break;
      case "performStationAction": {
        const action = data.actions.get(command.actionId);
        if (!action) {
          blockedReasons.push("Unknown station action");
          break;
        }
        require(action.requires);
        block(state.clock.tick < state.nextActionTick, "Action is cooling down");
        break;
      }
      default:
        blockedReasons.push("Unsupported command");
    }
    for (const [key, cost] of Object.entries(costs))
      block(wallet(game, key) + 1e-9 < cost, `Need more ${currencyName(key)}`);
    return { ok: blockedReasons.length === 0, costs, blockedReasons };
  }
  function currencyName(key: string) {
    if (key === "N") return "unassigned people";
    return data.resources.get(key)?.name ?? key;
  }
  function advanceProjects(game: Game, seconds: number): GameEvent[] {
    const station = game.state.academy;
    let completed = 0;
    for (let i = 0; i < station.timers.length; i++) {
      const elapsed = station.timers[i] + seconds;
      completed += Math.floor((elapsed + 1e-9) / balance.course.seconds);
      station.timers[i] = elapsed % balance.course.seconds;
    }
    if (!completed) return [];
    const reward = completed * multiplier(game, "teaching") + station.remainder;
    const whole = Math.floor(reward + 1e-9);
    station.remainder = Math.max(0, reward - whole);
    game.state.population.total += whole;
    return [
      event(
        game.state.clock.tick,
        "graduate",
        "academy",
        `${whole} graduate(s) ready for permanent appointments.`,
      ),
    ];
  }
  function produce(game: Game, output: Output, factor: number) {
    for (const [key, amount] of Object.entries(output)) {
      if (key === "training") continue;
      if (key === "science") {
        game.state.science.publications += amount * factor;
        continue;
      }
      game.state.resources[key as StockId] += amount * factor;
    }
  }
  function dispatch(game: Game, command: Command): CommandResult {
    const state = game.state;
    const quote = quoteCommand(game, command);
    if (!quote.ok) return { ...quote, events: [] };
    const before = availableInvestments(game).map((item) => item.id);
    for (const [key, cost] of Object.entries(quote.costs)) {
      if (key === "Insight") state.insight.points -= cost;
      else if (key !== "N") {
        const stock = key as StockId;
        state.resources[stock] = Math.max(0, state.resources[stock] - cost);
      }
    }
    const events: GameEvent[] = [];
    const emit = (type: string, id: string, detail: string) =>
      events.push(event(game.state.clock.tick, type, id, detail));
    const purchase =
      command.type === "buyInvestment" ? data.investments.get(command.investmentId) : undefined;
    if (command.type === "reviewOption") {
      if (!state.reviewedOptions.includes(command.investmentId))
        state.reviewedOptions.push(command.investmentId);
    } else if (command.type === "beginPrestige") {
      const award = concludeRun(game);
      emit(
        "prestige",
        "insight",
        `Run concluded. Earned ${award} Insight. All ordinary progress has reset.`,
      );
    } else if (command.type === "buyInsightUpgrade") {
      state.insight.upgrades[command.upgradeId] =
        (state.insight.upgrades[command.upgradeId] ?? 0) + 1;
      emit("insight", command.upgradeId, "Purchased a permanent Insight modifier.");
    } else if (command.type === "startNextRun") {
      state.insight.phase = "playing";
      emit(
        "run-started",
        String(state.clock.campaignIndex),
        `Run ${state.clock.campaignIndex} begins with permanent Insight modifiers.`,
      );
    } else if (command.type === "buyInvestment") {
      state.purchases[command.investmentId] = getPurchaseCount(game, command.investmentId) + 1;
      if (command.investmentId === "academy" || command.investmentId === "appoint-teacher")
        state.academy.timers.push(0);
      if (!state.reviewedOptions.includes(command.investmentId))
        state.reviewedOptions.push(command.investmentId);
      if (command.investmentId === definitions.finale.investmentId) {
        state.joint.completedAtTick = state.clock.tick;
        emit(
          "completion",
          command.investmentId,
          "Eyes on the Universe complete. Your connected network has completed its synthesis.",
        );
      }
      emit("purchase", command.investmentId, purchase?.name ?? command.investmentId);
    } else if (command.type === "processData")
      state.resources.K += command.quantity * analysisYield(game);
    else if (command.type === "performStationAction") {
      produce(game, actionOutput(game, command.actionId), 1);
      state.nextActionTick = state.clock.tick + balance.actionCooldownTicks;
    }
    if (command.type === "buyInvestment") {
      const target = data.discoveries.get(command.investmentId);
      if (target && !state.journal.includes(target.id)) {
        state.journal.push(target.id);
        emit("record", target.id, target.claim);
      }
    }
    if (command.type !== "reviewOption" && command.type !== "beginPrestige")
      events.push(...unlockEvents(before, game, purchase?.name));
    return { ...quote, events };
  }
  function advanceTicks(game: Game, count: number) {
    if (!Number.isSafeInteger(count) || count < 0)
      throw new Error("Tick count must be a nonnegative integer");
    if (game.state.insight.phase === "shop") return { events: [] };
    const before = availableInvestments(game).map((item) => item.id);
    const rates = productionRates(game);
    const events: GameEvent[] = [];
    for (let index = 0; index < count; index++) {
      produce(game, rates, TICK_SECONDS);
      game.state.clock.tick++;
      events.push(...advanceProjects(game, TICK_SECONDS));
    }
    events.push(...unlockEvents(before, game));
    return { events };
  }
  function insightPrice(game: Game, upgrade: InsightUpgrade) {
    return Math.ceil(
      upgrade.cost * upgrade.growth ** (game.state.insight.upgrades[upgrade.id] ?? 0),
    );
  }
  function previewPrestige(game: Game) {
    const blockedReasons = balance.prestige.requires
      .filter((id) => !hasPrerequisite(game, id))
      .map((id) => `Requires ${prerequisiteName(id)}`);
    if (game.state.insight.phase !== "playing") blockedReasons.push("Already between runs");
    const publications = game.state.science.publications;
    const extra = Math.floor(Math.sqrt(Math.max(0, publications - 1)));
    const potentialAward = balance.prestige.baseAward + extra;
    const expansion = data.investments.get("expanded-observatory");
    const rates = productionRates(game);
    const expansionWaitSeconds = expansion
      ? Math.max(
          ...["E", "F"].map((key) => {
            const currency = key as "E" | "F";
            const deficit = Math.max(
              0,
              (expansion.cost[currency] ?? 0) - game.state.resources[currency],
            );
            return deficit === 0 ? 0 : deficit / (rates[currency] || Number.MIN_VALUE);
          }),
        )
      : 0;
    const encouraged =
      blockedReasons.length === 0 &&
      !getPurchaseCount(game, "expanded-observatory") &&
      expansionWaitSeconds >= 300;
    return {
      encouraged,
      expansionWaitSeconds,
      eligible: blockedReasons.length === 0,
      blockedReasons,
      award: blockedReasons.length ? 0 : potentialAward,
      potentialAward,
      nextPublicationThreshold: (extra + 1) ** 2 + 1,
      run: game.state.clock.campaignIndex,
      seconds: game.state.clock.tick * TICK_SECONDS,
      losses: {
        resources: { ...game.state.resources },
        producers: data.producers.reduce((sum, item) => sum + getPurchaseCount(game, item.id), 0),
        telescopes: facilitySummary(game).telescopes,
        stations: definitions.stations.filter(
          (station) =>
            station.requires.length && station.requires.every((id) => hasPrerequisite(game, id)),
        ).length,
        purchases: Object.values(game.state.purchases).reduce((sum, count) => sum + count, 0),
        people: game.state.population.total,
        discoveries: game.state.journal.filter((id) => id !== "moon").length,
        publications,
        grants: grantCount(game),
        joint: structuredClone(game.state.joint),
        classrooms: game.state.academy.timers.length,
        researchTeams: game.state.purchases.photometry
          ? 1 + getPurchaseCount(game, "appoint-scientist")
          : 0,
        academy: {
          timers: [...game.state.academy.timers],
          remainder: game.state.academy.remainder,
        },
        science: { publications },
      },
      retained: { points: game.state.insight.points, upgrades: { ...game.state.insight.upgrades } },
    };
  }
  function concludeRun(game: Game) {
    const preview = previewPrestige(game);
    const insight = {
      ...game.state.insight,
      points: game.state.insight.points + preview.award,
      totalEarned: game.state.insight.totalEarned + preview.award,
      upgrades: { ...game.state.insight.upgrades },
      phase: "shop" as const,
      lastAward: preview.award,
    };
    const modified = game.state.modified;
    game.state = createRunState(balance, game.state.clock.campaignIndex + 1, insight);
    game.state.modified = modified;
    return preview.award;
  }
  return { quoteCommand, dispatch, advanceTicks, insightPrice, previewPrestige };
}
