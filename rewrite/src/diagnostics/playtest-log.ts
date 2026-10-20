import type { Command, CommandResult, GameState as Game } from "../core/types.ts";
type Snapshot = ReturnType<PlaytestLog["snapshot"]>;
type Entry = {
  sequence: number;
  at: string;
  type: string;
  trackedSeconds: number;
  sinceAction: number | null;
  sinceInvestment: number | null;
  sinceSpend: Record<string, number>;
  detail: Record<string, unknown>;
  before: Snapshot | null;
  after: Snapshot;
};
type Activity = {
  command: string;
  id: string;
  count: number;
  quantity: number;
  costs: Record<string, number>;
  gains?: Record<string, number>;
  before: Snapshot;
  after: Snapshot;
};
type LogData = {
  format: 1;
  startedAt: string;
  trackedTicks: number;
  nextSampleTick: number;
  sequence: number;
  droppedEntries: number;
  consoleEnabled: boolean;
  targetId: string | null;
  lastAction: number | null;
  lastInvestment: number | null;
  lastSpend: Record<string, number>;
  configurations: Record<string, unknown>;
  entries: Entry[];
  pending: Activity | null;
};
import { core as defaultCore, type Core } from "../core/index.ts";

import { TICK_SECONDS } from "../core/versions.ts";

const SAMPLE_TICKS = 30 / TICK_SECONDS;

const rounded = (value: number) => Math.round(value * 10000) / 10000;

export class PlaytestLog {
  core: Core;
  data: LogData;

  constructor(core: Core = defaultCore, saved: LogData | null = null) {
    this.core = core;

    this.data = saved ?? {
      format: 1,
      startedAt: new Date().toISOString(),
      trackedTicks: 0,
      nextSampleTick: SAMPLE_TICKS,
      sequence: 0,
      droppedEntries: 0,
      consoleEnabled: false,
      targetId: null,
      lastAction: null,
      lastInvestment: null,
      lastSpend: {},
      configurations: {},
      entries: [],
      pending: null,
    };
  }

  snapshot(game: Game) {
    const summary = this.core.getSummary(game);
    const stocks = {
      ...game.state.resources,
      N: summary.population.available,
      P: game.state.science.publications,
      Insight: game.state.insight.points,
    };
    const rates = {
      D: 0,
      F: 0,
      K: 0,
      I: 0,
      X: 0,
      E: 0,
      C: 0,
      ...summary.rates,
      N: summary.rates.training ?? 0,
      P: summary.rates.science ?? 0,
    };
    delete rates.training;
    delete rates.science;
    const nextId = this.data.targetId ?? summary.guidance.nextId;
    const item = this.core.definitions.investments.find((item) => item.id === nextId);
    const next = nextId
      ? {
          id: nextId,
          ...(item
            ? this.core.quoteCommand(game, {
                type: "buyInvestment",
                investmentId: nextId,
              })
            : { ok: false, costs: {}, blockedReasons: [summary.guidance.objective] }),
        }
      : null;
    // Support both the original per-run clock and later campaign-clock saves.
    const clock = game.state.clock as { totalTicks?: number; totalIsPartial?: boolean };
    return {
      at: new Date().toISOString(),
      config: game.balanceHash,
      run: game.state.clock.campaignIndex,
      runSeconds: game.state.clock.tick * TICK_SECONDS,
      campaignSeconds: clock.totalTicks === undefined ? null : clock.totalTicks * TICK_SECONDS,
      campaignTimePartial: clock.totalIsPartial ?? game.state.clock.campaignIndex > 1,
      trackedSeconds: this.data.trackedTicks * TICK_SECONDS,
      phase: game.state.insight.phase,
      stocks: Object.fromEntries(Object.entries(stocks).map(([id, value]) => [id, rounded(value)])),
      rates: Object.fromEntries(Object.entries(rates).map(([id, value]) => [id, rounded(value)])),
      people: summary.population,
      prestige: { eligible: summary.prestige.eligible, award: summary.prestige.award },
      next,
    };
  }

  mark(
    game: Game,
    type: string,
    detail: Record<string, unknown> = {},
    before: Snapshot | null = null,
  ) {
    this.flush();
    if (type === "restart" || type === "import") {
      this.data.lastAction = null;
      this.data.lastInvestment = null;
      this.data.lastSpend = {};
      this.data.targetId = null;
    }
    const inventory = ["session", "sample", "import", "restart", "export"].includes(type)
      ? {
          purchases: { ...game.state.purchases },
          insightUpgrades: { ...game.state.insight.upgrades },
        }
      : {};
    return this.append(type, { ...detail, ...inventory }, before, this.snapshot(game));
  }

  append(type: string, detail: Record<string, unknown>, before: Snapshot | null, after: Snapshot) {
    const seconds = after.trackedSeconds;

    const entry: Entry = {
      sequence: ++this.data.sequence,
      at: after.at,
      type,
      trackedSeconds: seconds,
      sinceAction: this.data.lastAction === null ? null : seconds - this.data.lastAction,
      sinceInvestment:
        this.data.lastInvestment === null ? null : seconds - this.data.lastInvestment,
      sinceSpend: Object.fromEntries(
        Object.entries(this.data.lastSpend).map(([id, time]) => [id, seconds - time]),
      ),
      detail,
      before,
      after,
    };
    this.data.entries.push(entry);
    if (this.data.consoleEnabled)
      console.info(
        `[playtest R${after.run} ${after.runSeconds.toFixed(1)}s | ${seconds.toFixed(1)}s tracked] ${type} ${typeof detail.id === "string" ? detail.id : typeof detail.investmentId === "string" ? detail.investmentId : ""}`,
        JSON.stringify(entry),
      );
    return entry;
  }

  session(game: Game, reason: string) {
    this.data.configurations[game.balanceHash] = {
      schemaVersion: game.schemaVersion,
      simulationVersion: game.simulationVersion,
      contentVersion: game.contentVersion,
      balanceHash: game.balanceHash,
      definitions: this.core.definitions,
      balance: this.core.balance,
    };
    this.mark(game, "session", {
      reason,
      balanceHash: game.balanceHash,
      historyStartsInRun: game.state.clock.campaignIndex,
      historyStartsAtRunSeconds: game.state.clock.tick * TICK_SECONDS,
    });
  }

  command(game: Game, command: Command, result: CommandResult, before: Snapshot) {
    if (command.type === "reviewOption") return;
    const id =
      "investmentId" in command
        ? command.investmentId
        : "actionId" in command
          ? command.actionId
          : "upgradeId" in command
            ? command.upgradeId
            : command.type;
    const grouped = command.type === "performStationAction" || command.type === "processData";
    if (
      this.data.pending &&
      (!grouped ||
        this.data.pending.command !== command.type ||
        this.data.pending.id !== id ||
        !result.ok)
    )
      this.flush();
    if (result.ok && command.type === "buyInvestment") {
      const item = this.core.definitions.investments.find(
        (item) => item.id === command.investmentId,
      );
      if (item && (game.state.purchases[item.id] ?? 0) >= item.maxLevel) this.data.targetId = null;
    }
    const after = this.snapshot(game);
    const previousInvestmentGap =
      this.data.lastInvestment === null ? null : after.trackedSeconds - this.data.lastInvestment;
    if (!result.ok) {
      this.append(
        "blocked",
        { command, id, reasons: result.blockedReasons, costs: result.costs },
        before,
        after,
      );
      return;
    }
    this.data.lastAction = after.trackedSeconds;
    if (command.type === "buyInvestment") this.data.lastInvestment = after.trackedSeconds;
    for (const [currency, cost] of Object.entries(result.costs))
      if (cost > 0) this.data.lastSpend[currency] = after.trackedSeconds;
    if (grouped) {
      const pending = this.data.pending ?? {
        command: command.type,
        id,
        count: 0,
        quantity: 0,
        costs: {},
        before,
        after,
      };
      pending.count++;
      pending.quantity += command.type === "processData" ? command.quantity : 0;
      pending.after = after;
      const gains = (pending.gains ??= {});
      for (const [currency, amount] of Object.entries(after.stocks)) {
        const gain = amount - (before.stocks[currency as keyof typeof before.stocks] ?? 0);
        if (gain > 0) gains[currency] = (gains[currency] ?? 0) + gain;
      }
      for (const [currency, cost] of Object.entries(result.costs))
        pending.costs[currency] = (pending.costs[currency] ?? 0) + cost;
      this.data.pending = pending;
    } else
      this.append(
        "command",
        {
          command,
          id,
          costs: result.costs,
          previousInvestmentGap,
          level:
            command.type === "buyInvestment"
              ? game.state.purchases[id]
              : command.type === "buyInsightUpgrade"
                ? game.state.insight.upgrades[id]
                : null,
          events: result.events,
        },
        before,
        after,
      );
  }

  inspect(game: Game, investmentId: string) {
    // Hovering does not replace the player's explicitly tracked purchase. Avoid
    // repeated full snapshots while the pointer moves around the same station.
    const previous = this.data.entries.at(-1);
    if (previous?.type === "inspect" && previous.detail.investmentId === investmentId) return;
    this.mark(game, "inspect", { investmentId });
  }
  track(game: Game, investmentId: string | null) {
    this.data.targetId = investmentId;
    this.mark(game, "track", { investmentId });
  }
  flush() {
    const pending = this.data.pending;
    if (!pending) return;
    this.data.pending = null;
    this.append(
      "activity",
      {
        command: pending.command,
        id: pending.id,
        count: pending.count,
        quantity: pending.quantity,
        costs: pending.costs,
        gains: pending.gains ?? {},
      },
      pending.before,
      pending.after,
    );
  }

  advanced(game: Game, ticks: number) {
    this.data.trackedTicks += ticks;
    if (this.data.trackedTicks >= this.data.nextSampleTick) {
      this.mark(game, "sample");
      this.data.nextSampleTick = this.data.trackedTicks + SAMPLE_TICKS;
    }
  }
  ticksUntilSample() {
    return Math.max(1, this.data.nextSampleTick - this.data.trackedTicks);
  }
  storageJSON() {
    return JSON.stringify(this.data);
  }

  export() {
    this.flush();
    return JSON.stringify(
      {
        currencyLegend: {
          D: "Data",
          K: "Knowledge",
          I: "Interest",
          F: "Funding",
          N: "Unassigned people",
          P: "Publications",
          X: "Expertise",
          E: "Engineering Progress",
          C: "Collaboration Credits",
          Insight: "Insight",
        },
        ...this.data,
        notes:
          "Tracked seconds count simulation advances observed by this log, excluding pauses/offline/shop. Run times identify the original save offset. Imports/restarts are marked, not assumed continuous campaigns. Missing sinceSpend keys have no recorded spend. The rewrite archives the full timeline in IndexedDB without an entry or size cap. Any droppedEntries were inherited from an older truncated log and cannot be recovered. Exports are local files, never uploaded automatically.",
      },
      null,
      2,
    );
  }
}
