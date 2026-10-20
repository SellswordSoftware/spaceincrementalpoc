# TypeScript core

The portable TypeScript economy is consumed by the Pixi landscape and HTML/CSS
station interface. The rewrite now uses 0.19.0-rewrite-balance / schema 14, with
playtest-driven refinements on top of the original 0.16.0 port. It remains separate
from the parent prototype's later schema 15/16 changes.

## Use

```ts
import { core, TICK_SECONDS } from "./src/core/index.ts";

const game = core.createGame();
const command = { type: "performStationAction", actionId: "observe" } as const;
const quote = core.quoteCommand(game, command);
if (quote.ok) core.dispatch(game, command);
core.advanceTicks(game, 1); // TICK_SECONDS is 0.25 seconds

const summary = core.getSummary(game);
const saved = core.serializeGame(game);
const restored = core.deserializeGame(saved);
```

`createCore(content, balance)` binds configuration once and returns the same API
for custom configurations. A core can operate on multiple independent games.
Commands and time advancement mutate the supplied game; quotes and summaries are
read-only queries. The host supplies timing, rendering, file/storage access and
pause behavior. Definitions and balance are immutable configuration: replace their
objects instead of editing them during a run, since lookups and fingerprints are
cached by identity.

Public queries include production rates, marginal investment previews, available
and unreviewed options, population/facility summaries and prestige previews. There
is no separate set of economic rules for the renderer.

## Organization and consolidation

- **Economy:** shared prerequisites, multipliers, rates, availability and population.
- **Simulation:** atomic quote/dispatch, continuous production, independent Academy
  cycles, prestige preview and transitions. Unsupported and unaffordable commands
  return reasons without spending resources.
- **State and saves:** a single run initializer, bound save operations, deterministic
  JSON/fingerprints and external-input validation. State types are inferred from the
  runtime save schema instead of a second handwritten description of those fields.
- **Migrations:** a table of exact historical configuration identities and isolated
  conversion logic. The unchanged schema accepts exact known baseline identities and upgrades their metadata without deleting progress.
- **Content:** shared purchase defaults, indexed definitions, revised balance values and authored progression guidance.
- **Diagnostics:** the separate `PlaytestLog` observer accepts a core, records its
  summaries, and retains the JSON format. The browser host archives the full timeline in IndexedDB; the recorder never truncates entries. Wall time, console output and
  log serialization stay outside the economic decisions.

The core has no Pixi, DOM, Tauri, filesystem or browser-storage imports. A separate
TypeScript check excludes DOM typings from the core and definitions. Standard
runtime facilities such as `TextEncoder` and `structuredClone` work in Node and
the browser; the host-specific diagnostics observer also uses `Date` and console.

## Verification and baseline

Run `npm run check`, `npm run typecheck`, `npm test`, and `npm run build`.
Three focused checks cover analysis/assistance scaling, baseline save migration and
finale/prestige, and retention beyond the old log limits. The frozen prototype parity
test was retired when the rewrite deliberately changed its economy. Browser checks
cover tracking, affordability feedback, and IndexedDB archive reload.

The starting revision was `3a504e0ed4956a30c4f7005c9744e03c85b9fe02` plus the working
tree's playtest recorder. The original core and definitions occupy 1,082 physical
lines as written, but many functions and entire content records occupy single
lines. Counting those against expanded TypeScript would reward compressed code.

The following measurements describe the initial port, before the UI and subsequent economy changes.
For a fair comparison, apply the same Vite+ 1.3.0 Oxfmt defaults to copies of both
versions. Count all core, definitions, types, migrations, helpers and diagnostics,
including guidance moved into content. Exclude the UI, tests, documentation and
tool configuration from both sides.

| Matched responsibility                   | Original | TypeScript |
| ---------------------------------------- | -------: | ---------: |
| Formatted physical lines                 |    3,427 |      3,411 |
| Lines containing non-comment code tokens |    3,282 |      3,281 |

The reduction is modest: explicit TypeScript types offset much of the removed
boilerplate. The substantive changes are configuration binding, shared indexed
lookups, schema-derived state types, one migration registry and common content
defaults. No code is minified or omitted from the comparison to claim a reduction.

## Next step

Continue refining the placeholder landscape and station interactions. Migrate the
newer parent-prototype save format as its own core change when needed. The original prototype remains independently runnable. Artwork, robotics,
new chapters and Tauri integration remain separate later work.

## Revised economy relationships

Analysis normalizes instant Knowledge per Data by frontier yield and observing
Insight, so larger Data volumes do not multiply Knowledge a second time. Analysis
Insight and practice still improve yields. Archives now generate 0.5 base Knowledge/s;
analysts generate 2/s, without draining Data. Analysis buttons preview their reward.

Assistance grants the larger of the original scaled click reward or 0.125 seconds
of that resource's current production. At the 0.25-second action cooldown, holding
adds 50% of passive production once developed, with the original reward as an early
floor. All existing stations keep running. This rule lives in the core and its previews.

Research partnerships and international consortia improve all base Funding,
including grants and fundraisers. Teaching team stock costs grow ×4 rather than ×3;
teaching practice adds 15% rather than 25% per level, retaining fixed 40-second cycles.
The infrared finale spreads preparation across science, analytical capacity,
Expertise and Collaboration Credits, with no extra project countdowns.
