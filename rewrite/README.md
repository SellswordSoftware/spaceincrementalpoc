# Eyes on the Universe — Web rewrite

Playable placeholder interface using TypeScript, PixiJS and HTML/CSS with Vite+.
The original prototype is separate and remains runnable from the parent directory.
See the [rewrite plan](../rewrite-plan.md) for the planned migration.

## Development

Use Node **26.12.0** and npm **12.2.0**, the current releases when scaffolded.
Node's bundled npm may be older; select the pinned Node version with your runtime
manager, then install npm 12.2.0 for that runtime if needed. Both `.node-version`
and `.nvmrc` are provided. This does not require a global Vite+ installation.

```sh
cd rewrite
npm ci
npm run dev
```

Open <http://localhost:5174>. The separate port avoids the prototype's default port.
The landscape uses graphic primitives and the ported economy. Hover a station for
its stats and purchases; hover or focus a purchase for a second descriptive popup.
Move into the panel to use its controls, or click a station to pin it open. Station
navigation buttons also support keyboard and touch. Drag the landscape to pan,
scroll to zoom, or use Overview and the camera buttons. Hold a station's help button
to assist it while all installed production continues.

Completed purchases hide automatically; the panel has a toggle to show them.
Gold stations/navigation badges indicate unreviewed options; teal edges and ready counts show affordable purchases. Track any purchase to pin its current readiness and estimated resource wait in the HUD. New systems reveal
as the network develops. Purchase prices and availability come from the core.

Prototype tools in the footer include time skips, simulation speed, save import/
export, playtest-log export and a fresh-game action. Rewrite saves/logs use separate
browser storage; the full playtest timeline is archived incrementally in IndexedDB. The original prototype's browser save is never overwritten.
Reload resumes paused. Hidden-tab time is not simulated.

The rewrite now uses **0.19.0-rewrite-balance / schema 14**, with the playtest-driven
balance changes recorded in the rewrite plan. Compatible 0.16.0 rewrite/baseline saves
migrate automatically, preserving stocks, Insight and completion. Existing surpluses
are retained; a fresh campaign gives the clearest comparison of the new balance.
Newer schema 15/16 parent-prototype saves still require a separate port.
Tauri is not installed yet.

```sh
npm run check       # Formatting, lint and type checks through Vite+
npm run typecheck   # TypeScript alone
npm test            # Three focused economy/save/log checks
npm run format     # Apply formatting
npm run build      # Typecheck and create dist/
npm run preview    # Serve the production build locally
```

The lockfile pins dependencies. Vite+ is installed locally and uses npm; there is
no runtime coupling to the prototype. The focused tests run directly against the rewrite core with Node's test runner.
The parent prototype has its own test command. Relative build URLs support static
hosting under a subpath. Deployment is not configured for this rewrite.

## Starting points

- `src/main.ts`: simulation loop, saves, diagnostics, HUD and prestige controls.
- `src/ui/world.ts`: Pixi primitives, station interaction and camera controls.
- `src/ui/panels.ts`: floating station panels and item tooltips.
- `src/style.css` and `index.html`: screen-space HTML/CSS interface.
- `vite.config.ts`: Vite+ build, lint/format checks and development server.
- `tsconfig.json`: strict TypeScript; current web typings supply Pixi's WebGPU types.

The [TypeScript core](CORE.md) now contains the prototype economy, progression,
prestige, saves and a separate diagnostics recorder. It runs without Pixi or browser
globals. The interface consumes its commands and queries without introducing a
second economy. Tauri remains the selected later desktop shell.

Tooling: [Vite+ local CLI](https://viteplus.dev/guide/local-cli),
[PixiJS quick start](https://pixijs.com/8.x/guides/getting-started/quick-start).
