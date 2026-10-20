import { Application, Container, Graphics, Rectangle, Text } from "pixi.js";
import type { StationId } from "../core/index.ts";

type StationView = { id: StationId; name: string; visible: boolean; open: boolean };
const sites: Record<StationId, [number, number]> = {
  observatory: [200, 650],
  analysis: [445, 650],
  outreach: [690, 685],
  support: [935, 685],
  academy: [1180, 605],
  research: [1425, 605],
  science: [1670, 540],
  engineering: [1915, 650],
  radio: [2180, 590],
  space: [1930, 250],
  joint: [2250, 160],
};

export async function createWorld(
  host: HTMLElement,
  select: (id: StationId, pin: boolean) => void,
  leave: () => void,
) {
  const app = new Application();
  await app.init({
    resizeTo: host,
    background: "#0a141e",
    antialias: true,
    autoDensity: true,
    resolution: Math.min(devicePixelRatio || 1, 2),
    preference: "webgl",
  });
  host.append(app.canvas);
  app.stop();
  app.stage.eventMode = "static";
  const world = app.stage.addChild(new Container());
  const stars = new Graphics();
  for (let i = 0; i < 160; i++)
    stars
      .circle((i * 397) % 2600, (i * 131) % 720, i % 5 === 0 ? 1.6 : 0.8)
      .fill({ color: 0xb7c8cf, alpha: 0.2 + (i % 4) * 0.12 });
  world.addChild(stars);
  world.addChild(
    new Graphics()
      .poly([
        -300, 680, 100, 560, 520, 620, 920, 570, 1250, 480, 1600, 470, 1900, 540, 2300, 440, 2800,
        570, 2800, 1300, -300, 1300,
      ])
      .fill(0x112532),
  );
  world.addChild(
    new Graphics()
      .poly([
        -300, 790, 250, 690, 750, 740, 1180, 660, 1670, 595, 1915, 705, 2300, 635, 2800, 710, 2800,
        1300, -300, 1300,
      ])
      .fill(0x18323c),
  );
  const route = new Graphics();
  for (const [id, [x, y]] of Object.entries(sites)) {
    if (id !== "observatory")
      route
        .moveTo(x - 220, y + 25)
        .lineTo(x, y + 25)
        .stroke({ color: 0x34505a, width: 1 });
  }
  world.addChild(route);
  const nodes = new Map<
    StationId,
    { root: Container; graphic: Graphics; label: Text; state: string }
  >();
  const colors = {
    open: 0x9bbeb6,
    locked: 0x536d78,
    fresh: 0xe3b969,
    ready: 0x64d9c3,
    selected: 0xeaf4ea,
  };
  function draw(graphic: Graphics, id: StationId, color: number) {
    graphic.clear().ellipse(0, 16, 65, 10).fill({ color: 0x000000, alpha: 0.2 });
    graphic.roundRect(-58, -5, 116, 16, 3).fill(0x233e47).stroke({ color, width: 2 });
    if (id === "observatory") {
      graphic
        .moveTo(-38, -8)
        .arc(0, -8, 38, Math.PI, 2 * Math.PI)
        .closePath()
        .fill(0x24414a)
        .stroke({ color, width: 2 });
      graphic.rect(-11, -65, 18, 55).fill(color).rect(-19, -70, 34, 10).fill(0xdee4ce);
    } else if (id === "radio") {
      graphic
        .moveTo(-40, -75)
        .quadraticCurveTo(0, 0, 40, -75)
        .lineTo(-40, -75)
        .fill(0x24414a)
        .stroke({ color, width: 2 });
      graphic
        .moveTo(0, -53)
        .lineTo(0, -5)
        .moveTo(-25, -5)
        .lineTo(0, -40)
        .lineTo(25, -5)
        .stroke({ color, width: 3 });
    } else if (id === "space" || id === "joint") {
      graphic.circle(0, -45, 29).fill(0x24414a).stroke({ color, width: 2 });
      graphic.rect(-75, -60, 36, 30).fill(0x294e61).stroke({ color, width: 1 });
      graphic.rect(39, -60, 36, 30).fill(0x294e61).stroke({ color, width: 1 });
      graphic
        .moveTo(-40, -45)
        .lineTo(40, -45)
        .moveTo(0, -75)
        .lineTo(0, -95)
        .stroke({ color, width: 2 });
    } else {
      const height = id === "academy" ? 55 : id === "research" ? 78 : 46;
      graphic
        .rect(-42, -height, 84, height - 6)
        .fill(0x24414a)
        .stroke({ color, width: 2 });
      if (id === "engineering")
        graphic
          .poly([-50, -46, -26, -65, -10, -46, 10, -65, 30, -46, 48, -60, 48, -46])
          .fill(color);
      else
        graphic
          .poly([-50, -height, 0, -height - 23, 50, -height])
          .fill(0x34535b)
          .stroke({ color, width: 2 });
      for (let x = -25; x <= 25; x += 25) graphic.rect(x - 4, -height + 15, 9, 12).fill(color);
      graphic.rect(-7, -24, 14, 18).fill(0x0a141e);
    }
    graphic.circle(54, -10, 4).fill(color);
  }
  for (const [id, point] of Object.entries(sites) as [StationId, [number, number]][]) {
    const root = world.addChild(new Container());
    root.position.set(...point);
    root.eventMode = "static";
    root.cursor = "pointer";
    root.hitArea = new Rectangle(-90, -110, 180, 165);
    const graphic = root.addChild(new Graphics());
    const label = root.addChild(
      new Text({
        text: "",
        style: { fontFamily: "monospace", fontSize: 13, fill: 0xc4d4ce, align: "center" },
      }),
    );
    label.anchor.set(0.5, 0);
    label.position.set(0, 34);
    root.on("pointerover", () => select(id, false));
    root.on("pointerout", leave);
    root.on("pointertap", () => {
      if (!dragged) select(id, true);
    });
    nodes.set(id, { root, graphic, label, state: "" });
  }
  let selected: StationId | null = null;
  function update(
    stations: StationView[],
    fresh: Set<StationId>,
    active: StationId | null,
    ready: Set<StationId>,
  ) {
    selected = active;
    for (const station of stations) {
      const node = nodes.get(station.id)!;
      node.root.visible = station.visible;
      const state = `${station.name}:${station.open}:${fresh.has(station.id)}:${ready.has(station.id)}:${active === station.id}`;
      if (state === node.state) continue;
      node.state = state;
      const color =
        active === station.id
          ? colors.selected
          : fresh.has(station.id)
            ? colors.fresh
            : ready.has(station.id)
              ? colors.ready
              : station.open
                ? colors.open
                : colors.locked;
      draw(node.graphic, station.id, color);
      node.label.text = station.name;
      node.label.style.fill = color;
    }
    app.render();
  }
  function anchor(id: StationId) {
    const point = world.toGlobal({ x: sites[id][0], y: sites[id][1] - 55 });
    const bounds = host.getBoundingClientRect();
    return { x: bounds.left + point.x, y: bounds.top + point.y };
  }
  function focus(id: StationId, enlarge = true) {
    if (enlarge && world.scale.x < 1) world.scale.set(1);
    const [x, y] = sites[id];
    world.position.set(
      app.screen.width * 0.38 - x * world.scale.x,
      app.screen.height * 0.55 - y * world.scale.y,
    );
    changed();
  }
  function overview() {
    const visible = [...nodes.values()].filter((node) => node.root.visible);
    const xs = visible.map((node) => node.root.x),
      ys = visible.map((node) => node.root.y);
    const left = Math.min(...xs) - 180,
      right = Math.max(...xs) + 240;
    const top = Math.min(...ys) - 220,
      bottom = Math.max(...ys) + 170;
    const scale = Math.min(
      1.4,
      app.screen.width / (right - left),
      app.screen.height / (bottom - top),
    );
    world.scale.set(scale);
    world.position.set(
      (app.screen.width - (right + left) * scale) / 2,
      (app.screen.height - (bottom + top) * scale) / 2,
    );
    changed();
  }
  const changeListeners = new Set<() => void>();
  function changed() {
    app.render();
    for (const listener of changeListeners) listener();
  }
  function zoom(factor: number, x = app.screen.width / 2, y = app.screen.height / 2) {
    const before = world.toLocal({ x, y });
    world.scale.set(Math.max(0.25, Math.min(2.4, world.scale.x * factor)));
    world.position.set(x - before.x * world.scale.x, y - before.y * world.scale.y);
    changed();
  }
  let drag: { x: number; y: number; startX: number; startY: number } | null = null;
  let dragged = false;
  const events = new AbortController();
  host.addEventListener(
    "pointerdown",
    (event) => {
      if (event.button !== 0) return;
      dragged = false;
      drag = { x: event.clientX, y: event.clientY, startX: world.x, startY: world.y };
    },
    { signal: events.signal },
  );
  window.addEventListener(
    "pointermove",
    (event) => {
      if (!drag) return;
      const dx = event.clientX - drag.x,
        dy = event.clientY - drag.y;
      if (Math.hypot(dx, dy) > 6) dragged = true;
      if (dragged) {
        world.position.set(drag.startX + dx, drag.startY + dy);
        changed();
      }
    },
    { signal: events.signal },
  );
  window.addEventListener(
    "pointerup",
    () => {
      drag = null;
    },
    { signal: events.signal },
  );
  host.addEventListener(
    "wheel",
    (event) => {
      event.preventDefault();
      const rect = host.getBoundingClientRect();
      zoom(Math.exp(-event.deltaY * 0.0015), event.clientX - rect.left, event.clientY - rect.top);
    },
    { passive: false, signal: events.signal },
  );
  app.renderer.on("resize", () => {
    if (selected) focus(selected, false);
    else overview();
  });
  return {
    update,
    anchor,
    focus,
    overview,
    zoom,
    onChange: (fn: () => void) => changeListeners.add(fn),
    destroy: () => {
      events.abort();
      app.destroy(true, { children: true });
    },
  };
}
export type World = Awaited<ReturnType<typeof createWorld>>;
