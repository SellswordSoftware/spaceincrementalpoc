# TypeScript core

The recorded prototype economy runs as standalone TypeScript. A Pixi landscape
and HTML/CSS station interface now consume it; the UI does not rebalance progression
or add economic rules. The runtime still uses the 0.16.0-pacing / schema 14 baseline,
not the newer economy now implemented in the parent prototype.

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
  conversion logic. The current schema/version/fingerprint remain unchanged.
- **Content:** original values/text, shared purchase defaults, indexed definitions,
  and authored progression guidance. Resolved definitions equal the original data.
- **Diagnostics:** the separate `PlaytestLog` observer accepts a core, records its
  summaries, and retains the existing JSON format. Wall time, console output and
  log serialization stay outside the economic decisions.

The core has no Pixi, DOM, Tauri, filesystem or browser-storage imports. A separate
TypeScript check excludes DOM typings from the core and definitions. Standard
runtime facilities such as `TextEncoder` and `structuredClone` work in Node and
the browser; the host-specific diagnostics observer also uses `Date` and console.

## Verification and baseline

Run `npm run check`, `npm run typecheck`, `npm test`, and `npm run build`.
There is one parity test, reading the recorded Git revision into a temporary
directory and reusing its ordinary-command scenarios through an adapter. It requires
Git, tar and the baseline commit in local history. It compares quotes, events, summaries and state
changes through the first-run ending and prestige/rebuild. It also checks portable
save round trips, the prior balance-only migration and diagnostic sampling/reset
continuity. The adapter is test-only: production modules import no prototype code.
Retire the comparison when the old implementation is deliberately retired.

The starting revision was `3a504e0ed4956a30c4f7005c9744e03c85b9fe02` plus the working
tree's playtest recorder. The original core and definitions occupy 1,082 physical
lines as written, but many functions and entire content records occupy single
lines. Counting those against expanded TypeScript would reward compressed code.

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
newer prototype economy/save format as its own core change with an updated parity
baseline. The original prototype remains independently runnable. Artwork, robotics,
new chapters and Tauri integration remain separate later work.
