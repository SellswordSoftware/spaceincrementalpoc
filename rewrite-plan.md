# Eyes on the Universe — Production Rewrite Plan

Date: 2026-10-18. Status: implementation plan; no rewrite implemented yet.

This plan is for the developer carrying the playable prototype into a production
foundation. It defines what to preserve, what to simplify, and the order in which
to deliver a web game followed by a Tauri desktop release.

## 1. Decisions and scope

- **Simulation:** strict TypeScript, independent of the renderer and host platform.
- **Landscape:** PixiJS, with a camera that pans and zooms through physical stations.
- **Interface:** HTML/CSS for readable resource totals, purchases, menus and details.
- **Build:** Vite, with a separate TypeScript check; static web output first.
- **Desktop:** Tauri 2 after the web experience is established. No Electron.
- **Artwork:** mixed media permitted. Raster scenery/buildings, vector or procedural
  connections and indicators, with assets sized for the intended closest zoom.
- **Economic scope:** preserve the implemented economy and balance during conversion.
  Future robotics, probes and station transformations remain separate content work.

Web delivery must continue to support GitHub Pages project paths and itch.io
embedding. Desktop loads packaged local assets and must work without a server.
Android/iOS remain future possibilities. Playdate and Arduboy require separate
presentation/adaptation decisions; this stack does not promise direct exports.
Rust, Zig and WASM are deferred unless measured costs or a concrete native target
justify them. Tauri's Rust shell does not require a Rust simulation.

## 2. Rewrite objective: less logic, expressed more clearly

This is a consolidation, not a line-by-line translation with added interfaces.
Replace JSDoc scaffolding with direct types, combine duplicated calculations, and
remove obsolete structure. Do not create a framework around a small economy.

At planning time, the checked-out source contains these physical line counts:

| Existing responsibility | Lines |
|---|---:|
| Core excluding playtest recorder | 766 |
| Playtest recorder | 134 |
| Content, balance and resource definitions | 182 |
| Combined | 1,082 |

Refresh the baseline from the actual implementation starting point, since gameplay
may change before work starts. Record the commit and counting method before edits.

Acceptance requires **fewer handwritten lines for the equivalent converted core**
and a smaller combined core/content/diagnostics total. Establish the comparable
baseline by formatting a copy of the original with the intended rewrite formatter;
the raw counts above are a source inventory, not a reason to compress the rewrite.
Include TypeScript types,
save compatibility code and helpers wherever they move. Moving code into another
folder, generation, dependency or UI layer does not count as removing it.

Report physical lines and nonblank/noncomment lines, using consistent readable
formatting for comparison. A reduction achieved only by deleting JSDoc is not
enough: identify the duplicated decisions and unnecessary machinery removed.
Do not compress statements, omit useful types, hide logic in data strings, or
remove supported behavior to meet the count. Simplify the design if it exceeds
the budget. New landscape and native-shell code is reported separately because
it supplies functionality the prototype does not yet have.

## 3. Behavior to preserve

- Independent stations continue producing while another station receives attention.
- A shared Data wallet, instant Data analysis and permanent archive investments.
- Permanent purchases/appointments; no allocations, wages or automatic wallet drains.
- Academy classrooms retain independent cycles; improvements increase rewards.
  Other implemented scientific production retains its continuous resource behavior.
- Publications remain cumulative qualifications, including shared grant capacity.
- Existing currencies, costs, rounding, prerequisites, cooldowns and multipliers.
- Equipment/facility progression, journal discoveries and completion behavior.
- Full prestige reset, Insight payout, saved shop state and permanent modifiers.
  Unlocks remain reachable without a mandatory prestige count.
- New-option indicators, review state and compact handling of completed purchases
  wherever present in the implementation baseline.
- Save import/export, pause/speed controls and the diagnostic timeline across runs.

Inventory the actual baseline rather than reconstructing it from historical plan
sections. Do not accidentally restore superseded timed science or synthesis waits.
Track desired economy changes separately so presentation work cannot disguise
balance regressions.

## 4. Small core, one source for each calculation

Use a few cohesive modules: model/content, economy/queries, commands/time advancement,
prestige, and saves. These are responsibilities, not mandatory one-file boundaries.
Keep diagnostics alongside the core as a consumer of its public operations.

The public surface should remain roughly: create a game, quote a command, apply a
command, advance simulation time, read a summary, encode/decode a save. Pass content
and balance through a small explicit context when useful; avoid repeated bundles
of arguments, hidden global state, or a dependency-injection system.

Consolidation targets:

- Compile content once into stable-ID lookups. Reuse those lookups instead of
  repeatedly searching definitions throughout commands, summaries and validation.
- Calculate prices, prerequisites, qualification gates and affordability in one
  quote path. Applying a command uses that quote; neither UI nor diagnostics
  independently reproduces economic rules.
- Centralize output-to-stat mappings, permanent multipliers and production totals.
  Summaries, assistance, prestige estimates and actual production use the same math.
- Derive population availability, facilities and unlocked targets from authoritative
  state. Avoid saving redundant totals that must be synchronized after purchases.
- Keep prerequisite logic general enough for current milestones, with explicit
  handling for genuine exceptions. Do not build an expression language or universal
  effect/plugin system for a handful of special cases.
- Place progression guidance with content instead of spreading target-ID chains
  across the UI and simulation. Preserve the distinction between required next
  milestones and optional growth suggestions.
- Keep runtime validation at external boundaries and content initialization.
  TypeScript types do not validate imported JSON. Avoid revalidating immutable
  definitions or hashing them on every tick or ordinary summary read.
- Isolate legacy save conversion from live economic logic. Consolidate repetitive
  version matching without silently accepting incompatible configurations.

Use ordinary records, functions, discriminated command unions and plain serializable
state. No actor/ECS representation of economic producers, class hierarchy per
station, general event bus, or parallel handwritten schemas for every internal type.

The core must import no Pixi, DOM, browser storage, Tauri, filesystem or wall-clock
APIs. Host code supplies elapsed time and writes saves. Diagnostics supplies its own
wall timestamps and console/storage/export integration outside economic decisions.

## 5. Timing, numbers and resource efficiency

Preserve the current fixed simulation step initially. Rendering has an independent
animation loop. A slow frame does not change production, and a camera animation
does not advance economic time. Preserve classroom phases, fractional rewards and
cooldowns through save/load and reset.

Aggregate producers as counts/rates; visual workers are optional representations,
not economic entities. Invalidate derived economy calculations when their inputs
change. Do not add a complicated cache before profiling establishes a need.
Batch long advances where behavior permits, preserving milestone/timer boundaries
and the playtest recorder's sampling points. Keep the current pause/offline policy
unless a separate gameplay decision changes it.

Retain JavaScript numbers and existing numeric semantics for parity. Before adding
far-future content, review numeric range, precision and save representation. Do not
introduce an arbitrary-precision library or a generic numeric abstraction now.

Measure simulation time separately from rendering, UI updates, texture memory and
logging. Update displayed numbers at a readable cadence; do not rebuild all panels
or serialize the full game each animation frame. Keep log retention bounded.

## 6. Zoomable landscape and responsive interface

Stations occupy stable world coordinates. The camera owns position and zoom;
window dimensions define the viewport, not the simulation or world layout.

- Support drag-to-pan, wheel/trackpad zoom, touch gestures and keyboard alternatives.
  Zoom around the pointer where appropriate, with bounded travel and zoom ranges.
- Selecting a station focuses it and opens a screen-space details panel. Provide
  overview/reset-camera navigation and avoid camera movement during purchases.
- Keep resource totals, navigation, prices and important text at readable screen
  sizes rather than shrinking them with the landscape.
- At distant zoom show recognizable silhouettes, activity and new-option markers;
  reveal decoration and animation progressively as the camera approaches.
- Preserve camera focus through resizing and fullscreen changes. Reflow panels for
  narrow windows instead of scaling a fixed desktop interface down to illegibility.
- Route pointer/wheel input correctly: interacting with a panel must not also pan
  or zoom the landscape beneath it. Keep DOM controls keyboard accessible.
- Keep camera/selection preferences separate from economic save state. Any optional
  persistence of those preferences must not affect production or portability.

Use one Pixi application with a transformed world container and HTML/CSS interface.
Separate station art from its economic definition through stable IDs and a small
presentation mapping. Equipment tiers can add or replace visual layers while all
previous economic contributions remain intact. Reuse the same station scene for
future institution transformations rather than creating duplicate panels.

Choose an intended maximum zoom before producing assets. Use texture atlases,
reusable shapes and a few detail levels where useful. Cull offscreen decoration,
reduce distant animation and cap render pixel density where needed. Neither vector
art nor an unrestricted high-DPI framebuffer is an automatic performance win.

## 7. Web and desktop platform boundary

Define a small adapter only for operations actually needed: save storage, portable
file import/export, fullscreen and lifecycle notifications. Browser implementation
uses browser facilities; desktop implementation uses Tauri where appropriate.
Keep native imports out of the shared browser bundle.

Run the simulation beside the renderer in the webview initially. Do not send every
tick or displayed currency over native IPC. Desktop Rust handles native services;
Steam integration is a later explicit task, including overlay/controller behavior
verification if required. Use Steam's update/distribution flow for Steam builds;
do not automatically add a competing updater.

Use a versioned portable save envelope. Preserve progress from the current supported
prototype format through an explicit importer; retain export and existing saves
until conversion succeeds. Keep old migrations in a compatibility area if needed,
included in the size accounting. Do not overwrite the prototype storage key during
development or force existing hosted players into an unfinished rewrite.

Tauri is selected, but real packaged graphics remain an acceptance check. Exercise
the intended Windows/macOS/Linux targets, particularly WebKit-based rendering on
Linux and Steam Deck if included. Do not infer frame pacing or memory use from
installer size. Browser and native adapters must consume the same economic core.

## 8. Delivery order

| Step | Deliverable | Exit condition |
|---|---|---|
| R0 — Baseline | Inventory implemented behavior, supported saves, content fingerprint, size counts and one representative command trace | Existing prototype remains runnable; parity and size comparisons are reproducible |
| R1 — Consolidated TypeScript core | Typed content/model, shared economy calculations, commands, timing, prestige and saves; headless execution | Fewer equivalent core lines; representative progression and prestige agree with the baseline |
| R2 — Thin web shell | Vite browser build using the new core and a functional HTML/CSS station interface; adapt diagnostics | Current content is playable and saves/logs portable; project-path and iframe hosting work |
| R3 — Landscape slice | Three representative stations, placeholder art, pan/zoom/focus, HUD and station panel | Small-window/fullscreen behavior, input separation and measured rendering cost are acceptable |
| R4 — Full visual campaign | Map all current stations and facility tiers into the landscape; integrate unlock/review/completion feedback | Human playthrough reaches completion and prestige without losing clarity or economic behavior |
| R5 — Web release candidate | Asset pass, loading/error handling, responsive polish and static hosting deployment preparation | Normal browser playtest, save continuation and diagnostic export accepted |
| R6 — Tauri desktop | Native storage/file/window adapter, packaged builds and release configuration | Same saves/economy; acceptable graphics and resource use on intended desktop targets |
| R7 — New chapters | Robotics/probes/advanced station transformations from the game plan | Scope and balance agreed separately after the foundation proves useful |

Keep the prototype runnable while assembling the replacement. Use a separate entry
or output during transition; avoid maintaining two active economic implementations
after R2 parity is established. Do not start a new framework, mobile release or
WASM rewrite as part of these steps.

## 9. Minimal verification and completion criteria

Reuse the existing scenario tools and the relevant integration test. Add only a
small parity check that executes an ordinary-command route through economic growth,
Academy cycles, late-game completion and a prestige/rebuild. Compare important
balances/rates, purchases, rewards and times, allowing explicitly documented numeric
tolerance. Include save continuation and one differently chunked time advance if
time batching changes. Do not expand into a failure-mode or edge-case suite.

Browser checks cover camera behavior, panels, resizing/fullscreen, meaningful
purchase feedback, import/export and logging. Desktop gets the same small smoke
pass in packaged builds. Track frame time, memory and simulation cost on a named
reference device with a representative scene; agree budgets from the slice rather
than claim performance before measurement.

The rewrite is accepted when current gameplay is preserved, the converted core is
smaller and easier to follow, the landscape supports the desired zoom/focus pattern,
web delivery works independently, and the desktop wrapper adds no economic fork.
Report the size comparison and concrete simplifications alongside verification.


## Playtest refinements — 2026-10-18

Implemented in the web rewrite as 0.19.0-rewrite-balance (schema 14). These changes
respond to the retained late-run portion of eyes-rewrite-playtest.json; earlier runs
were missing, so the first-prestige timing still needs a fresh complete playtest.

- Preserve complete campaign logs in an incremental IndexedDB archive. Migrate the
  previous localStorage log on load, retain inherited dropped-entry counts, and record
  assistance gains separately from passive production. Hovering no longer changes
  the explicitly tracked purchase. Existing missing history cannot be reconstructed.
- Normalize instant analysis for frontier volume and observing Insight. Strengthen
  archives (0.5 base Knowledge/s) and analysts (2/s); show conversion rewards before
  spending Data. Keep analysis immediate while observing continues.
- Add research partnerships (Interest/Knowledge/Expertise) and international funding
  consortia (Interest/Knowledge/Collaboration) as staged Funding productivity upgrades.
- Distinguish new options (gold) from affordable purchases (teal). Add explicit Track
  controls, a persistent purchase display, current-production wait estimates, and
  readiness-transition feedback. Estimates assume resources are saved for the target.
- Reduce the infrared Engineering concentration: shield 144k, commissioning 96k.
  Commissioning also requires network integration, 300 Expertise and 1,500 Credits.
  Increase late observing research Knowledge requirements; deep-time teams require
  6,000 Publications and 2,000 Credits. Add a unified deep-field catalog requiring
  12,000 Publications and spending Data, 600k Knowledge, 600 Expertise and 4,000 Credits.
  Synthesis qualifies at 15,000 Publications and spends 400k Knowledge and 6,000 Credits.
  Publications remain cumulative qualifications. All purchases are instant.
- Teaching teams retain asynchronous 40-second cycles. Their stock costs grow ×4
  instead of ×3; teaching practice adds 15% rather than 25% graduates per level.
- Assistance scales with station capacity: each action gives at least 0.125 seconds
  of current resource production (50% extra when continuously held at four actions/s),
  while preserving the original early click reward as a floor.

Preserve existing saves, Insight, stocks and earned completion through a known-baseline
metadata migration. Do not erase previous Knowledge surpluses or grandfathered teachers.
A new campaign is the appropriate next balance comparison. The original prototype
remains separate; its newer schema and campaign-clock migration are not part of this work.
