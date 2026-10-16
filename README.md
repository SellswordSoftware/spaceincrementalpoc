# Eyes on the Universe

A graphics-free incremental astronomy prototype. The browser and headless Node.js
tooling will share a deterministic simulation; the economy is validated before
artwork or a final engine is selected.

## Run locally

Use **Node.js 24.16.0** (the installed Node 24 LTS runtime at project setup) and
npm. `.node-version` and `.nvmrc` pin the runtime for compatible version managers.

```sh
npm ci
npm run dev
```

Open <http://127.0.0.1:5173>. The server binds only to the local machine.
Set `PORT` to choose another port, for example `PORT=5174 npm run dev`.
Stop it with Ctrl+C. Serve the page over HTTP so browser ES modules load.

## Verify

```sh
npm run check
npm test
node --input-type=module -e "import { createGame } from './src/core/index.js'; console.log(createGame().state.resources)"
```

The strict JSDoc checks emit no files. Browser code has DOM types and no Node
globals; tooling and tests have Node types and no DOM globals. Shared core code
is checked in both environments. TypeScript and Node type declarations are
exactly pinned development dependencies; there are no runtime dependencies or
bundler.

Browser smoke checklist: start the server, open the URL, and confirm that the
status reads “P2 — Simulation kernel: starter state ready (25 Funding, one founder, one telescope).” Check
that there are no browser errors or failed module/style requests, then reload
and confirm the same result.

## Implementation status

P0 provides the ES module entry points, plain browser shell, localhost static
server, separate type checks, and Node test entry. The tests exercise shared-core
import and actual HTTP serving, including module MIME types and private paths.
P1 adds the ten resource contracts, upgrade persistence classes, prerequisite
validation, starter content definitions, fixture A, and canonical save/load.
The browser creates the same starter state as Node.

P2 adds fixed ticks, shared-input reservations, atomic commands, rate summaries,
and events. The default recipe list is empty: P3 adds the reachable starter
economy. P4 adds playable controls. Simulation/sweep commands and reports arrive
in later packages.

## Definitions and saves

`src/definitions/resources.js` declares resource storage, spending, reveal, and
reset behavior. `content.js` contains the initial target/instrument/upgrade
definitions and named gates. Later resource reveal gates reserve IDs, rather
than implement those systems. Numerical seeds live in `balance.js`; prices,
effects, and curves remain untested design inputs.

```js
import { createGame, serializeGame, deserializeGame } from './src/core/index.js';

let game = createGame();
const json = serializeGame(game);
game = deserializeGame(json); // Only replace the active game after success.
```

All three functions also accept `(definitions, balance)` after their main
argument; `createGame(definitions, balance)` has no main argument. They default
to the bundled configuration. The core has no storage, timers, DOM, or Node
imports. Save/load currently uses strings through this API; browser import/export
controls and autosave are later work.

The save envelope identifies schema, content, simulation, and balance versions.
Its deterministic FNV-1a configuration fingerprint covers both the balance
object and assembled definitions, including purchase/effect seeds. It detects
configuration changes even when a version label was not changed; it is not a
cryptographic checksum or proof of legitimate play. A mismatched configuration
is rejected rather than silently rebased. No migrations are needed before
public saves exist.

Validation rejects invalid references, dependency cycles, unsupported effects,
bad persistence classes, nonfinite/negative stocks and costs, invalid counts,
unknown fields, and out-of-bounds upgrade levels. Permanent, campaign, and
Legacy upgrade levels occupy distinct state partitions. Population groups,
typed data, evidence, programs, Legacy purchase history, and preference arrays
remain empty until their corresponding subsystems are implemented.

P1 findings: definition acyclicity and save integrity do not prove economic
reachability. The first executable progression check belongs to P3.

## Simulation kernel

```js
import {
  advanceTicks, balance, createGame, definitions, dispatch, getSummary,
} from './src/core/index.js';

const game = createGame();
advanceTicks(game, definitions, balance, 40); // Exactly 10 simulated seconds.
console.log(getSummary(game, definitions, balance));
// Once a recipe is defined, configure it through dispatch rather than editing state:
// dispatch(game, definitions, balance, {
//   type: 'setJobAllocation', jobId: 'example', recipeId: 'example', allocation: 1,
// });
```

Commands available in P2: `buyUpgrade`, `purchaseInstrument`, `setJobAllocation`,
`setFounderTask`, and `setJobPriority`. A founder task selects a job ID, or `null`
for idle. Recipe and instrument allocations share a capacity of one; a founder
can work only on the selected job. Finite jobs preserve fractional progress,
release allocation on completion, and emit one completion event. Legacy buying,
people, programs, and prestige commands arrive with their respective packages.

`quoteCommand` describes costs and blocked reasons without mutation. `dispatch`
rechecks the command and spends only on success. Both use the argument order
`(game, definitions, balance, command)`. Immediate callers retain returned command
results as history; rejected actions do not alter the save.

`advanceTicks(game, definitions, balance, count, schedule?)` executes identical
0.25-second ticks. Optional scheduled entries are `{ tick, sequence, command }`;
ticks are absolute, and sequence breaks ties. Entries execute before production
at their boundary. The same schedule can be reused across successive advances.
Returned history separates accepted and rejected commands, alongside events.
It is kept outside the canonical save; callers persist future schedules as part
of a replay rather than silently saving an adapter queue.

Each tick reserves inputs from starting inventories in descending priority,
then ascending job ID (code-unit order). Outputs become usable next tick.
Shortages fund partial work without debt. Summaries show the next tick's actual
gross/net rates, modifiers, and blocked reasons without advancing the game.
Modifiers add level bonuses within a persistence category and multiply across
categories. Only gates explicitly marked `autoUnlock` unlock from prerequisites;
science milestones require their own accomplishments in P3 and later.

P2 verification uses one small kernel scenario for atomic spending, snapshot
reservations, priority, single completion, and matching chunked/save continuation.
Its stock recipes are fixtures rather than game content. The initial browser
shell remains idle until controls are implemented. Schema 2 and simulation
`0.2.0-p2` intentionally reject the earlier prototype saves.

See [the game design](eyes-on-the-universe-game-plan.md) and
[the implementation plan](eyes-on-the-universe-prototype-implementation-plan.md)
for the progression, persistence rules, and package acceptance gates.
