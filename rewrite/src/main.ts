import { core, TICK_SECONDS, type Command, type GameState } from "./core/index.ts";
import { PlaytestLog } from "./diagnostics/playtest-log.ts";
import { createWorld } from "./ui/world.ts";
import { createPanels, element, number } from "./ui/panels.ts";
import "./style.css";

const SAVE_KEY = "eyes.rewrite.save.v1",
  LOG_KEY = "eyes.rewrite.log.v1";
const get = <T extends HTMLElement = HTMLElement>(id: string) => document.getElementById(id) as T;

async function start() {
  const events = new AbortController(),
    listen = { signal: events.signal };
  let game: GameState = core.createGame(),
    log = new PlaytestLog(core),
    canSave = true;
  let running = true,
    speed = 1,
    held: string | null = null,
    dirty = false;
  function message(text: string) {
    get("message").textContent = text;
  }
  try {
    const saved = localStorage.getItem(SAVE_KEY);
    if (saved) {
      game = core.deserializeGame(saved);
      running = false;
    }
  } catch {
    canSave = false;
    message(
      "Saved progress could not load. It is preserved; import a save or start a new game to replace it.",
    );
  }
  try {
    const saved = localStorage.getItem(LOG_KEY);
    if (saved) {
      const data = JSON.parse(saved);
      if (data.format === 1 && Array.isArray(data.entries)) log = new PlaytestLog(core, data);
    }
    log.session(game, "web-ui");
  } catch {
    log = new PlaytestLog(core);
    log.session(game, "web-ui");
  }
  function persist() {
    if (canSave)
      try {
        localStorage.setItem(SAVE_KEY, core.serializeGame(game));
        dirty = false;
      } catch {
        message("Saving is unavailable. Export your game to keep a copy.");
      }
    try {
      localStorage.setItem(LOG_KEY, log.storageJSON());
    } catch {
      message("Playtest log could not be saved locally. Export it to keep a copy.");
    }
  }
  function hold(id: string | null) {
    held = id;
    if (id) send({ type: "performStationAction", actionId: id }, true);
    else log.flush();
  }
  let panels: ReturnType<typeof createPanels> | undefined;
  const world = await createWorld(
    get("scene"),
    (id, pin) => {
      panels?.select(id, pin);
      refresh();
    },
    () => panels?.leave(),
  );
  panels = createPanels(
    () => game,
    (command) => send(command),
    (id) => {
      log.inspect(game, id);
      send({ type: "reviewOption", investmentId: id }, true);
    },
    hold,
    world,
  );
  function send(command: Command, quiet = false) {
    const before = command.type === "reviewOption" ? null : log.snapshot(game);
    const result = core.dispatch(game, command);
    if (before && (result.ok || !quiet)) log.command(game, command, result, before);
    if (!result.ok) {
      if (!quiet) message(result.blockedReasons.join(" · "));
      return;
    }
    dirty = true;
    if (command.type === "beginPrestige") {
      held = null;
      running = false;
      panels?.close();
    }
    if (command.type === "startNextRun") {
      running = true;
      get<HTMLDialogElement>("prestige-dialog").close();
    }
    if (!quiet) {
      message(
        result.events
          .filter((event) => ["unlock", "record", "completion"].includes(event.type))
          .map((event) => event.detail)
          .join(" ") ||
          (command.type === "buyInvestment"
            ? "Investment added to the network."
            : command.type === "processData"
              ? "Data analyzed. Observations continue."
              : "Network updated."),
      );
      refresh();
      persist();
      if (get<HTMLDialogElement>("prestige-dialog").open) renderPrestige();
    }
  }
  function advance(ticks: number) {
    while (ticks > 0 && game.state.insight.phase === "playing") {
      if (held) send({ type: "performStationAction", actionId: held }, true);
      const count = Math.min(ticks, held ? 1 : log.ticksUntilSample());
      const { events } = core.advanceTicks(game, count);
      log.advanced(game, count);
      ticks -= count;
      dirty = true;
      const milestones = events.filter((event) =>
        ["unlock", "record", "completion"].includes(event.type),
      );
      if (milestones.length) {
        log.mark(game, "milestone", { events: milestones });
        message(milestones.map((event) => event.detail).join(" "));
      }
    }
  }
  const balances = new Map(
    core.definitions.resources.map((resource) => {
      const node = element("div", "balance"),
        amount = element("strong"),
        rate = element("small");
      node.append(
        element("span", "", resource.id === "N" ? "People" : resource.name),
        amount,
        rate,
      );
      get("balances").append(node);
      return [resource.id, { node, amount, rate }];
    }),
  );
  const navigation = new Map(
    core.definitions.stations.map((station) => {
      const button = element("button", "station-link"),
        label = element("span", "", station.name),
        badge = element("small");
      button.append(label, badge);
      button.dataset.station = station.id;
      button.addEventListener(
        "click",
        (event) => {
          world.focus(station.id);
          panels!.select(station.id, true);
          if (event.detail === 0)
            get("station-panel").querySelector<HTMLButtonElement>("button")?.focus();
          refresh();
        },
        listen,
      );
      get("station-nav").append(button);
      return [station.id, { button, badge }];
    }),
  );
  const completionDialog = get<HTMLDialogElement>("completion-dialog");
  let completionSeen = false,
    resumeAfterCompletion = false;
  function showCompletion() {
    const tick = game.state.joint.completedAtTick;
    if (tick === null || completionDialog.open) return;
    hold(null);
    panels?.close();
    resumeAfterCompletion = running;
    running = false;
    completionSeen = true;
    const seconds = Math.floor(tick * TICK_SECONDS);
    get("completion-stats").textContent =
      `Completed on run ${game.state.clock.campaignIndex} at ${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, "0")}.`;
    completionDialog.showModal();
  }
  function dismissCompletion() {
    completionDialog.close();
    running = resumeAfterCompletion;
    refresh();
  }
  get("completion-status").addEventListener(
    "click",
    () => {
      showCompletion();
      refresh();
    },
    listen,
  );
  get("continue-observing").addEventListener("click", dismissCompletion, listen);
  get("completion-prestige").addEventListener(
    "click",
    () => {
      dismissCompletion();
      get("prestige").click();
    },
    listen,
  );
  completionDialog.addEventListener(
    "cancel",
    (event) => {
      event.preventDefault();
      dismissCompletion();
    },
    listen,
  );
  function refresh() {
    const summary = core.getSummary(game);
    const fresh = new Set(summary.newOptions.map((item) => item.station));
    const reveals: Record<string, boolean> = {
      D: true,
      K: core.hasPrerequisite(game, "analysis-tools"),
      I: core.hasPrerequisite(game, "outreach"),
      F: core.hasPrerequisite(game, "support-office"),
      N: core.hasPrerequisite(game, "academy"),
      X: core.hasPrerequisite(game, "research"),
      E: core.hasPrerequisite(game, "engineering"),
      P: core.hasPrerequisite(game, "photometry"),
      C: core.hasPrerequisite(game, "joint-science"),
      Insight: game.state.insight.totalEarned > 0,
    };
    for (const [id, view] of balances) {
      view.node.hidden = !reveals[id];
      const value =
        id === "N"
          ? summary.population.available
          : id === "P"
            ? game.state.science.publications
            : id === "Insight"
              ? game.state.insight.points
              : game.state.resources[id as keyof typeof game.state.resources];
      const rate =
        id === "N"
          ? summary.rates.training
          : id === "P"
            ? summary.rates.science
            : summary.rates[id as keyof typeof summary.rates];
      view.amount.textContent = number(value);
      view.rate.textContent = id === "Insight" ? "permanent" : `+${number(rate ?? 0)}/s`;
    }
    for (const station of summary.stations) {
      const view = navigation.get(station.id)!;
      view.button.hidden = !station.visible;
      view.button.classList.toggle("is-new", fresh.has(station.id));
      view.button.classList.toggle("is-active", panels?.active === station.id);
      view.button.setAttribute("aria-pressed", String(panels?.active === station.id));
      const count = summary.newOptions.filter((item) => item.station === station.id).length;
      view.badge.textContent = count ? `${count} new` : station.open ? "" : "Establish";
    }
    world.update(summary.stations, fresh, panels?.active ?? null);
    panels?.update();
    get("objective").textContent = summary.guidance.objective;
    const seconds = Math.floor(summary.seconds);
    get("clock").textContent = `Run ${game.state.clock.campaignIndex} · ${Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0")}:${(seconds % 60).toString().padStart(2, "0")}`;
    const completed = game.state.joint.completedAtTick !== null;
    get("completion-status").hidden = !completed;
    if (!completed) completionSeen = false;
    else if (!completionSeen && !get<HTMLDialogElement>("prestige-dialog").open) showCompletion();
    get("pause").textContent = running ? "Pause" : "Resume";
    get("pause").setAttribute("aria-pressed", String(!running));
    get("prestige").hidden = !summary.prestige.eligible && game.state.insight.totalEarned === 0;
  }
  const dialog = get<HTMLDialogElement>("prestige-dialog");
  let resumeAfterReview = false;
  function renderPrestige() {
    const shop = game.state.insight.phase === "shop",
      preview = core.previewPrestige(game);
    get("prestige-title").textContent = shop
      ? `${game.state.insight.points} Insight to spend`
      : "A new perspective";
    get("prestige-copy").textContent = shop
      ? "Permanent modifiers carry into every new run. Unspent Insight can be saved."
      : `Earn ${preview.award} Insight. All ordinary currencies, people, stations and discoveries reset; only Insight and its upgrades persist.`;
    get("insight-shop").replaceChildren();
    get("confirm-prestige").hidden = shop;
    get<HTMLButtonElement>("confirm-prestige").disabled = !preview.eligible;
    get("cancel-prestige").hidden = shop;
    get("start-run").hidden = !shop;
    if (shop)
      for (const upgrade of core.definitions.insightUpgrades) {
        const row = element("div", "shop-item");
        const quote = core.quoteCommand(game, { type: "buyInsightUpgrade", upgradeId: upgrade.id });
        const button = element("button", "", `${core.insightPrice(game, upgrade)} Insight`);
        button.disabled = !quote.ok;
        button.addEventListener("click", () =>
          send({ type: "buyInsightUpgrade", upgradeId: upgrade.id }),
        );
        row.append(
          element(
            "h3",
            "",
            `${upgrade.name} · ${game.state.insight.upgrades[upgrade.id] ?? 0}/${upgrade.maxLevel}`,
          ),
          element("p", "muted", upgrade.description),
          button,
        );
        get("insight-shop").append(row);
      }
  }
  get("prestige").addEventListener(
    "click",
    () => {
      hold(null);
      resumeAfterReview = running;
      running = false;
      log.mark(game, "prestige-review");
      renderPrestige();
      dialog.showModal();
      refresh();
    },
    listen,
  );
  function cancelPrestige() {
    if (game.state.insight.phase === "shop") return;
    dialog.close();
    running = resumeAfterReview;
    log.mark(game, "prestige-cancel");
    refresh();
  }
  dialog.addEventListener(
    "cancel",
    (event) => {
      event.preventDefault();
      cancelPrestige();
    },
    listen,
  );
  get("cancel-prestige").addEventListener("click", cancelPrestige, listen);
  get("confirm-prestige").addEventListener("click", () => send({ type: "beginPrestige" }), listen);
  get("start-run").addEventListener(
    "click",
    () => {
      send({ type: "startNextRun" });
      world.overview();
    },
    listen,
  );
  get("pause").addEventListener(
    "click",
    () => {
      hold(null);
      running = !running;
      log.mark(game, running ? "resume" : "pause");
      refresh();
    },
    listen,
  );
  get("overview").addEventListener(
    "click",
    () => {
      panels!.close();
      world.overview();
      refresh();
    },
    listen,
  );
  get("zoom-in").addEventListener("click", () => world.zoom(1.2), listen);
  get("zoom-out").addEventListener("click", () => world.zoom(1 / 1.2), listen);
  get("fullscreen").addEventListener(
    "click",
    () => {
      void (
        document.fullscreenElement
          ? document.exitFullscreen()
          : document.documentElement.requestFullscreen()
      ).catch(() => message("Fullscreen is unavailable in this window."));
    },
    listen,
  );
  get<HTMLSelectElement>("speed").addEventListener(
    "change",
    (event) => {
      speed = Number((event.target as HTMLSelectElement).value);
      log.mark(game, "speed", { speed });
    },
    listen,
  );
  for (const seconds of [10, 60])
    get(`advance-${seconds}`).addEventListener(
      "click",
      () => {
        hold(null);
        log.mark(game, "time-skip", { seconds });
        advance(seconds / TICK_SECONDS);
        refresh();
        persist();
      },
      listen,
    );
  function download(raw: string, filename: string) {
    const url = URL.createObjectURL(new Blob([raw], { type: "application/json" }));
    const link = element("a");
    link.href = url;
    link.download = filename;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  get("export").addEventListener(
    "click",
    () => download(core.serializeGame(game), "eyes-rewrite-save.json"),
    listen,
  );
  get("export-log").addEventListener(
    "click",
    () => {
      log.mark(game, "export");
      download(log.export(), "eyes-rewrite-playtest.json");
    },
    listen,
  );
  get<HTMLInputElement>("import").addEventListener(
    "change",
    async (event) => {
      const input = event.target as HTMLInputElement,
        file = input.files?.[0];
      if (!file) return;
      try {
        const candidate = core.deserializeGame(await file.text()),
          before = log.snapshot(game);
        hold(null);
        panels!.close();
        completionDialog.close();
        completionSeen = false;
        game = candidate;
        canSave = true;
        running = false;
        log.session(game, "import");
        log.mark(game, "import", {}, before);
        refresh();
        world.overview();
        persist();
        if (game.state.insight.phase === "shop") {
          renderPrestige();
          dialog.showModal();
        }
        message("Save imported. Resume when ready.");
      } catch (error) {
        message(`Import failed: ${error instanceof Error ? error.message : "invalid save"}`);
      }
      input.value = "";
    },
    listen,
  );
  get("restart").addEventListener(
    "click",
    () => {
      if (
        !confirm(
          "Start a fresh rewrite game, including resetting Insight? Export first to keep this run.",
        )
      )
        return;
      const before = log.snapshot(game);
      hold(null);
      panels!.close();
      completionDialog.close();
      completionSeen = false;
      game = core.createGame();
      canSave = true;
      running = true;
      log.mark(game, "restart", {}, before);
      refresh();
      world.overview();
      persist();
      message("A fresh sky. Hover the observatory to begin.");
    },
    listen,
  );
  window.addEventListener("pointerup", () => hold(null), listen);
  window.addEventListener("blur", () => hold(null), listen);
  let last = performance.now(),
    accumulator = 0,
    nextRender = 0,
    frame = 0;
  document.addEventListener(
    "visibilitychange",
    () => {
      held = null;
      accumulator = 0;
      last = performance.now();
      if (document.hidden) persist();
    },
    listen,
  );
  window.addEventListener("pagehide", persist, listen);
  function loop(now: number) {
    const delta = Math.min(1, (now - last) / 1000);
    last = now;
    if (running && !document.hidden && game.state.insight.phase === "playing") {
      accumulator += delta * speed;
      const ticks = Math.floor(accumulator / TICK_SECONDS);
      if (ticks) {
        advance(ticks);
        accumulator -= ticks * TICK_SECONDS;
      }
    } else accumulator = 0;
    if (now >= nextRender) {
      refresh();
      nextRender = now + 250;
    }
    frame = requestAnimationFrame(loop);
  }
  refresh();
  world.overview();
  if (game.state.insight.phase === "shop") {
    running = false;
    renderPrestige();
    dialog.showModal();
  }
  frame = requestAnimationFrame(loop);
  const saving = setInterval(() => {
    if (dirty) persist();
  }, 5000);
  import.meta.hot?.dispose(() => {
    cancelAnimationFrame(frame);
    clearInterval(saving);
    persist();
    events.abort();
    panels?.destroy();
    world.destroy();
  });
}
void start().catch((error: unknown) => {
  console.error(error);
  get("message").textContent = "Unable to start the scene. See console for details.";
});
