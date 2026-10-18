import { Application, Container, Graphics } from "pixi.js";
import "./style.css";

async function start() {
  const host = document.querySelector<HTMLDivElement>("#scene")!;
  const app = new Application();
  await app.init({
    resizeTo: host,
    background: "#101725",
    antialias: true,
    autoDensity: true,
    resolution: Math.min(window.devicePixelRatio || 1, 2),
    preference: "webgl",
  });
  host.append(app.canvas);

  const world = app.stage.addChild(new Container());
  const planet = new Graphics()
    .circle(0, 0, 108)
    .stroke({ color: 0x384860, width: 1 })
    .circle(0, 0, 42)
    .fill(0x8fb5cd);
  world.addChild(planet);
  world.addChild(new Graphics().circle(108, 0, 6).fill(0xe4c58d));

  function layout() {
    world.position.set(app.screen.width / 2, app.screen.height / 2);
    world.scale.set(Math.min(1, app.screen.width / 300, app.screen.height / 300));
  }
  layout();
  app.renderer.on("resize", layout);
  document.querySelector("#status")!.textContent = "PixiJS ready";

  // Render only on resize until the game needs an animation loop.
  app.stop();
  app.render();
  app.renderer.on("resize", () => app.render());
  import.meta.hot?.dispose(() => app.destroy(true, { children: true }));
}

void start().catch((error: unknown) => {
  console.error(error);
  document.querySelector("#status")!.textContent = "Renderer failed to start. See console.";
});
