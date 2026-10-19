import {
  core,
  type Command,
  type GameState,
  type Investment,
  type StationId,
} from "../core/index.ts";
import type { World } from "./world.ts";

const fine = new Intl.NumberFormat("en", { maximumFractionDigits: 2 });
const regular = new Intl.NumberFormat("en", { maximumFractionDigits: 1 });
const compact = new Intl.NumberFormat("en", { maximumFractionDigits: 1, notation: "compact" });
export const number = (value: number) =>
  (Math.abs(value) >= 10000 ? compact : Math.abs(value) < 100 ? fine : regular).format(value);
export function element<K extends keyof HTMLElementTagNameMap>(tag: K, className = "", text = "") {
  const node = document.createElement(tag);
  node.className = className;
  node.textContent = text;
  return node;
}
const names = new Map(
  core.definitions.resources.map((resource) => [
    resource.id,
    resource.id === "N" ? "people" : resource.name,
  ]),
);
export const costs = (values: Record<string, number>) =>
  Object.entries(values)
    .map(([id, value]) => `${number(value)} ${names.get(id) ?? id}`)
    .join(" · ") || "Free";

export function createPanels(
  getGame: () => GameState,
  send: (command: Command) => void,
  inspect: (id: string) => void,
  hold: (id: string | null) => void,
  world: World,
) {
  const panel = document.querySelector<HTMLElement>("#station-panel")!;
  const body = document.querySelector<HTMLElement>("#station-body")!;
  const title = document.querySelector<HTMLElement>("#station-title")!;
  const tooltip = document.querySelector<HTMLElement>("#item-tooltip")!;
  const pin = document.querySelector<HTMLButtonElement>("#pin-panel")!;
  let active: StationId | null = null,
    pinned = false;
  let closeTimer = 0;
  let detail: { item: Investment; row: HTMLElement } | null = null;
  const rows = new Map<
    string,
    { row: HTMLElement; owned: HTMLElement; buy: HTMLButtonElement; fresh: HTMLElement }
  >();
  const actions = new Map<string, HTMLButtonElement>();
  const stats = element("div", "station-stats");
  const help = element("div", "station-actions");
  const purchases = element("div", "purchase-list");
  const empty = element("p", "muted", "More options appear as the network develops.");
  const completed = element("input");
  completed.type = "checkbox";
  const completedLabel = element("label", "completed-toggle");
  completedLabel.append(completed, document.createTextNode(" Show completed purchases"));
  const events = new AbortController();
  const listen = { signal: events.signal };
  function cancelClose() {
    clearTimeout(closeTimer);
  }
  function hideDetail() {
    tooltip.hidden = true;
    detail?.row.removeAttribute("aria-describedby");
    detail = null;
  }
  function close() {
    cancelClose();
    hideDetail();
    panel.hidden = true;
    active = null;
    pinned = false;
    hold(null);
  }
  function leave() {
    cancelClose();
    if (!pinned) closeTimer = window.setTimeout(close, 450);
  }
  function position() {
    if (!active || panel.hidden) return;
    const point = world.anchor(active);
    const topLimit = document.querySelector("#hud")!.getBoundingClientRect().bottom + 12;
    panel.style.maxHeight = `${Math.max(100, innerHeight - topLimit - 65)}px`;
    const bounds = panel.getBoundingClientRect();
    const narrow = innerWidth < 720;
    const x = narrow
      ? 12
      : point.x + 70 + bounds.width < innerWidth - 16
        ? point.x + 70
        : point.x - bounds.width - 70;
    panel.style.left = `${Math.max(12, Math.min(innerWidth - bounds.width - 12, x))}px`;
    panel.style.top = `${narrow ? Math.max(topLimit, innerHeight - bounds.height - 65) : Math.max(topLimit, Math.min(innerHeight - bounds.height - 65, point.y - 100))}px`;
    if (detail) positionDetail(detail.row);
  }
  function positionDetail(row: HTMLElement) {
    const anchor = row.getBoundingClientRect(),
      main = panel.getBoundingClientRect();
    const width = tooltip.offsetWidth,
      height = tooltip.offsetHeight;
    const right = main.right + 10;
    const x = right + width < innerWidth - 12 ? right : main.left - width - 10;
    tooltip.style.left = `${Math.max(12, Math.min(innerWidth - width - 12, x))}px`;
    tooltip.style.top = `${Math.max(12, Math.min(innerHeight - height - 12, anchor.top))}px`;
  }
  function renderDetail() {
    if (!detail) return;
    const { item, row } = detail,
      game = getGame();
    const quote = core.quoteCommand(game, { type: "buyInvestment", investmentId: item.id });
    const preview = core.previewInvestment(game, item.id);
    const explanation = element("p", "", item.effect);
    const improvements = Object.entries(preview.passive).map(
      ([id, value]) =>
        `+${number(value)} ${id === "science" ? "Publications" : id === "training" ? "people (average)" : (names.get(id) ?? id)}/s`,
    );
    if (preview.activeGain > 0)
      improvements.push(`+${number(preview.activeGain)} per ${preview.actionName}`);
    if (preview.analysisGain > 0)
      improvements.push(`+${number(preview.analysisGain)} Knowledge per 10 Data analyzed`);
    tooltip.replaceChildren(
      element("span", "eyebrow", "Investment details"),
      element("h3", "", item.name),
      explanation,
    );
    if (improvements.length) tooltip.append(element("p", "gain", improvements.join(" · ")));
    if (item.publications)
      tooltip.append(
        element(
          "p",
          "muted",
          `Requires ${number(item.publications)} cumulative Publications; never spent.`,
        ),
      );
    tooltip.append(
      element(
        "p",
        quote.ok ? "gain" : "blocked",
        quote.ok ? `Ready · ${costs(quote.costs)}` : quote.blockedReasons.join(" · "),
      ),
    );
    tooltip.hidden = false;
    row.setAttribute("aria-describedby", "item-tooltip");
    positionDetail(row);
  }
  function showDetail(item: Investment, row: HTMLElement) {
    hideDetail();
    detail = { item, row };
    inspect(item.id);
    renderDetail();
  }
  function select(id: StationId, shouldPin = false) {
    cancelClose();
    if (pinned && !shouldPin && active !== id) return;
    if (active !== id) {
      hold(null);
      hideDetail();
      active = id;
      rows.clear();
      actions.clear();
      const station = core.definitions.stations.find((station) => station.id === id)!;
      title.textContent = station.name;
      document.querySelector("#station-subtitle")!.textContent = station.subtitle;
      body.replaceChildren(
        element("p", "station-description", station.use),
        stats,
        help,
        purchases,
        empty,
        completedLabel,
      );
      help.replaceChildren();
      purchases.replaceChildren();
      for (const action of core.definitions.actions.filter((action) => action.station === id)) {
        const button = element("button", "assist", action.name);
        button.title = "Click or hold to help this station. All installed stations keep producing.";
        button.addEventListener("pointerdown", (event) => {
          if (event.button === 0) {
            button.setPointerCapture(event.pointerId);
            hold(action.id);
          }
        });
        button.addEventListener("pointerup", () => hold(null));
        button.addEventListener("pointercancel", () => hold(null));
        button.addEventListener("click", (event) => {
          if (event.detail === 0) send({ type: "performStationAction", actionId: action.id });
        });
        help.append(button);
        actions.set(action.id, button);
      }
      if (id === "analysis")
        for (const quantity of [10, "all"] as const) {
          const button = element(
            "button",
            "assist",
            quantity === "all" ? "Analyze all Data" : "Analyze 10 Data",
          );
          button.dataset.analysis = String(quantity);
          button.addEventListener("click", () =>
            send({
              type: "processData",
              quantity: quantity === "all" ? getGame().state.resources.D : quantity,
            }),
          );
          help.append(button);
        }
      for (const item of core.definitions.investments.filter((item) => item.station === id)) {
        const row = element("div", "purchase");
        row.tabIndex = 0;
        row.dataset.investment = item.id;
        const heading = element("div", "purchase-heading"),
          fresh = element("span", "new-dot", "New");
        const owned = element("span", "owned");
        heading.append(element("h3", "", item.name), fresh, owned);
        const buy = element("button", "buy");
        buy.dataset.buy = item.id;
        buy.addEventListener("click", () => send({ type: "buyInvestment", investmentId: item.id }));
        row.append(heading, buy);
        row.addEventListener("mouseenter", () => showDetail(item, row));
        row.addEventListener("mouseleave", hideDetail);
        row.addEventListener("focusin", () => showDetail(item, row));
        row.addEventListener("focusout", (event) => {
          if (!row.contains(event.relatedTarget as Node | null)) hideDetail();
        });
        purchases.append(row);
        rows.set(item.id, { row, owned, buy, fresh });
      }
    }
    pinned = shouldPin || pinned;
    panel.hidden = false;
    pin.textContent = pinned ? "Unpin" : "Pin";
    pin.setAttribute("aria-pressed", String(pinned));
    update();
    position();
  }
  function update() {
    if (!active) return;
    const game = getGame(),
      summary = core.getSummary(game);
    const station = summary.stations.find((station) => station.id === active)!;
    panel.dataset.locked = String(!station.open);
    const lines: string[] = [];
    const resource: Partial<Record<StationId, string>> = {
      observatory: "D",
      analysis: "K",
      outreach: "I",
      support: "F",
      research: "X",
      engineering: "E",
      science: "science",
      joint: "C",
    };
    const output = resource[active];
    if (output)
      lines.push(
        `${number(summary.rates[output as keyof typeof summary.rates] ?? 0)} ${output === "science" ? "Publications" : names.get(output)}/s`,
      );
    if (active === "observatory")
      lines.push(`${summary.frontier.name} · Data yield ×${summary.frontier.yield}`);
    if (active === "analysis") lines.push(`${number(core.analysisYield(game))} Knowledge per Data`);
    if (active === "support")
      lines.push(`${summary.grants.active} grants / ${summary.grants.capacity} Publication slots`);
    if (active === "academy") {
      lines.push(
        `${number(summary.population.available)} unassigned · ${number(summary.population.total)} trained`,
      );
      lines.push(
        `${summary.academy.timers.length} independent classes · ${number(summary.academy.reward)} people/cycle`,
      );
      if (summary.academy.timers.length)
        lines.push(
          `Next graduation in ${number(summary.academy.seconds - Math.max(...summary.academy.timers))}s`,
        );
    }
    if (active === "radio" || active === "space")
      lines.push(`${number(summary.branches[active]?.rate ?? 0)} Data/s from this branch`);
    if (active === "space")
      for (const mission of summary.missions.filter((mission) => mission.commissioned))
        lines.push(`${mission.name}: ${number(mission.rate)} Publications/s`);
    if (active === "science")
      lines.push(
        `${summary.science.teams} ground research teams · ${number(game.state.science.publications)} Publications`,
      );
    if (!station.open)
      lines.push(`Establish this station below. All installed stations continue working.`);
    stats.replaceChildren(...lines.map((line) => element("div", "stat-line", line)));
    for (const action of core.definitions.actions.filter((action) => actions.has(action.id))) {
      const button = actions.get(action.id)!;
      button.hidden = !action.requires.every((id) => core.hasPrerequisite(game, id));
      button.textContent = `${action.name} · +${costs(core.scaledOutput(game, action.output))}`;
    }
    for (const button of help.querySelectorAll<HTMLButtonElement>("[data-analysis]")) {
      button.hidden = !core.hasPrerequisite(game, "analysis-tools");
      button.setAttribute(
        "aria-disabled",
        String(game.state.resources.D < (button.dataset.analysis === "10" ? 10 : Number.EPSILON)),
      );
    }
    let visible = 0;
    const fresh = new Set(summary.newOptions.map((item) => item.id));
    for (const item of core.definitions.investments.filter((item) => rows.has(item.id))) {
      const view = rows.get(item.id)!,
        count = game.state.purchases[item.id] ?? 0;
      const done = count >= item.maxLevel;
      const establishing = !station.open && station.requires.includes(item.id);
      view.row.hidden =
        (!establishing && !item.requires.every((id) => core.hasPrerequisite(game, id))) ||
        (done && !completed.checked);
      if (!view.row.hidden) visible++;
      if (view.row.hidden && detail?.item.id === item.id) hideDetail();
      view.owned.textContent = count
        ? `${count}${item.maxLevel < 1000 ? ` / ${item.maxLevel}` : ""} owned`
        : "";
      view.fresh.hidden = !fresh.has(item.id);
      const quote = core.quoteCommand(game, { type: "buyInvestment", investmentId: item.id });
      view.buy.textContent = done
        ? "Completed"
        : `${item.kind === "appointment" ? "Appoint" : item.kind === "upgrade" ? "Improve" : item.kind === "discovery" ? "Research" : "Build"} · ${costs(quote.costs)}`;
      view.buy.setAttribute("aria-disabled", String(!quote.ok));
    }
    empty.hidden = visible > 0;
    renderDetail();
    position();
  }
  panel.addEventListener("pointerenter", cancelClose, listen);
  panel.addEventListener("pointerleave", leave, listen);
  panel.addEventListener("focusin", cancelClose, listen);
  panel.addEventListener(
    "focusout",
    (event) => {
      if (!panel.contains(event.relatedTarget as Node | null)) leave();
    },
    listen,
  );
  completed.addEventListener("change", update, listen);
  panel.querySelector(".panel-close")!.addEventListener("click", close, listen);
  pin.addEventListener(
    "click",
    () => {
      pinned = !pinned;
      pin.textContent = pinned ? "Unpin" : "Pin";
      pin.setAttribute("aria-pressed", String(pinned));
    },
    listen,
  );
  window.addEventListener(
    "keydown",
    (event) => {
      if (event.key === "Escape") close();
    },
    listen,
  );
  world.onChange(position);
  return {
    select,
    leave,
    update,
    close,
    get active() {
      return active;
    },
    destroy: () => {
      close();
      events.abort();
    },
  };
}
