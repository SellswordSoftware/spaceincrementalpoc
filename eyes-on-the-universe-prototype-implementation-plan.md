# Eyes on the Universe — Prototype Implementation Plan

Version 1.0 — 2026-10-15

## 1. Purpose and authority

Build a graphics-free, browser-playable incremental economy with the same deterministic simulation available to headless Node.js runs. Use it to validate system relationships, production mathematics, progression, and prestige before selecting a final game engine or producing art.

Companion design: **eyes-on-the-universe-game-plan.md, draft 0.3**. Its resource meanings, scientific boundaries, central infrastructure progression, and retained-network prestige are the design baseline. This document supplies implementation decisions and executable work packages. Numerical values below are initial experiment inputs, not tested balance or promises about completion time.

The requested deliverable here is an implementation plan, not implemented software. All commands, module names, scenarios, and tests below describe work to build.

### Outcomes

- Play U00–U10 through one prestige and a visibly faster second campaign.
- Extend the same model through surveys, engineering, growing observatories, radio, two separate space missions, joint science, and a finite ending.
- Explain every resource rate and blocked action.
- Compare reproducible play policies and parameter variants.
- Preserve hardware, people, qualifications, and automation across campaign closure.
- Produce evidence for balance decisions rather than tune solely by intuition.

### Scope boundaries

No game engine, canvas, artwork, telescope aiming, real orbital simulation, backend accounts, multiplayer, cloud saves, deployment, mobile packaging, or offline catch-up. No generic mod engine, ECS, expression language, database, or optimizer. Browser DOM controls are sufficient. Scientific tasks are named, curated numerical requirements; no external astronomy API is needed.

## 2. Technology decisions

| Area | Choice | Constraint |
|---|---|---|
| Language | JavaScript ES modules, `.js`, package `type: module` | Runtime-neutral simulation imports |
| Types | JSDoc with `checkJs`, `strict`, `noEmit` | Type state, commands, definitions, and reports; avoid annotating trivial locals |
| Interactive UI | Plain HTML/CSS/DOM | No framework or bundler |
| Automation runtime | Node.js | Pin an available supported LTS version at implementation start |
| Tests | `node:test`, `node:assert/strict` | Behavior and invariants rather than implementation mirroring |
| Balance | Commented JavaScript objects with stable IDs | Serializable values; no callbacks in balance definitions |
| Persistence | JSON exports plus localStorage convenience | Explicit schema/content/balance versions |
| Reports | JSON summary, CSV sampled metrics, optional HTML comparison table | Reports identify configuration and policy |
| Development tooling | Pinned TypeScript checker and matching Node type declarations | Development dependencies only; no runtime packages initially |
| Serving | Small Node static server bound to localhost | Browser modules served over HTTP |

The Node-only tooling may use `node:` imports. Browser/shared modules may not. Type checking need not emit executable code. Keep browser typing and Node tooling configurations separate so Node globals do not silently leak into the shared core.

Suggested scripts: `npm run dev`, `npm run check`, `npm test`, `npm run simulate -- ...`, `npm run sweep -- ...`. Pin exact tool versions and commit the lockfile. These scripts do not imply an npm-dependent application runtime.

## 3. Repository and module boundaries

| Path | Responsibility |
|---|---|
| `README.md` | Start, test, simulate, reproduce a report |
| `package.json`, lockfile | Scripts and pinned development tools |
| `jsconfig.json`, `tools/jsconfig.json` | Browser/core and Node checking |
| `index.html`, `styles.css` | Plain playable shell |
| `src/definitions/resources.js` | Resource kinds and reset classes |
| `src/definitions/balance.js` | Starting amounts, rates, costs, curves |
| `src/definitions/content.js` | Targets, facilities, recipes, upgrades, unlocks, programs |
| `src/core/types.js` | Shared JSDoc typedefs |
| `src/core/validate.js` | Definition and imported-state validation |
| `src/core/state.js` | State creation and canonical serialization |
| `src/core/commands.js` | Quotes, validation, and atomic actions |
| `src/core/simulation.js` | One tick, job allocation, completion ordering |
| `src/core/rates.js` | Modifier calculation and explanations |
| `src/core/programs.js` | Evidence, programs, scoring, rewards |
| `src/core/prestige.js` | Preview, award, persistence, new campaign |
| `src/core/summary.js` | Read-only UI/report view model |
| `src/ui/app.js` | DOM rendering, input, frame loop |
| `src/ui/storage.js` | Browser save/export/import adapters |
| `tools/server.js` | Local static server |
| `tools/simulate.js` | Headless runner |
| `tools/policies.js` | Shared policy interface and initial policies |
| `tools/sweep.js` | Parameter experiments |
| `tools/report.js` | Report serialization and comparisons |
| `test/` | Core behavior and representative integration tests |
| `scenarios/` | Commands, checkpoints, reproducible case definitions |
| `reports/` | Generated experiment output; do not commit large run batches |

Start with fewer files if helpful; split when responsibilities actually grow. Keep the listed boundaries even if adjacent responsibilities initially share a module. Core modules must never import UI, tooling, timers, storage, or browser globals.

## 4. Core API and command contract

```js
createGame(definitions, balance, options) // -> GameState
quoteCommand(game, definitions, balance, command) // -> costs/effects/blocked reasons
dispatch(game, definitions, balance, command) // -> result; mutates only on success
advanceTicks(game, definitions, balance, count) // -> tick events
getSummary(game, definitions, balance) // -> read-only presentation data
previewPrestige(game, definitions, balance) // -> payout, losses, retained items
```

Use mutable state inside the simulation for simplicity and throughput. No function that quotes or summarizes may mutate it. Commands are plain JSON objects. `dispatch` validates against the current state, not an earlier quote.

Initial commands: `setFounderTask`, `setInstrumentTask`, `buyUpgrade`, `purchaseFacilityStage`, `setAudienceAllocation`, `assignPeople`, `setJobAllocation`, `startTraining`, `startProgram`, `setJobPriority`, `concludeCampaign`, `buyLegacyUpgrade`.

Add `setAutoBuyRule` only after the second-campaign flow is understood. Pause, speed, export, import, and debug resource grants are adapter/development controls, not ordinary economic commands. Debug use marks the run as modified.

All resource spending is atomic. Invalid IDs, unmet prerequisites, insufficient resources, incompatible equipment, and unavailable staff return structured errors with no state change. Command history records accepted and rejected commands separately. Normal reports count accepted gameplay actions; rejection diagnostics remain available.

## 5. State and definitions

### State partitions

| Partition | Stored information |
|---|---|
| Envelope | Save schema version, content version, balance ID/hash, simulation version |
| Clock | Integer tick, campaign start tick, campaign index |
| Resources | F, K, X, E, C, I; Legacy separately; typed data inventories |
| Institution | Built facilities, paid project stages, installed modules, qualifications |
| Population | Integer counts by qualification combination and job assignment; founder tracked separately |
| Jobs | Recipe, instrument, allocation, priority, persistent fractional progress |
| Investigations | Evidence ledgers, temporal coverage, active/completed program instances |
| Campaign | Operational upgrades, specializations, P, S, grant slots, C upgrades |
| Lifetime | Journal, archived findings, ever-unlocked gates, depth bonuses already claimed |
| Legacy | Currency, permanent upgrade levels, purchase history |
| Preferences | Saved assignment and auto-buy policies; no UI DOM state |

Derived totals, modifier products, and display rates are recomputed, not saved as competing sources of truth. Keep report history outside the canonical state except short journal/event references and necessary replay metadata.

### Definitions

Every definition has a stable ID and named prerequisite IDs. Upgrades declare a persistence class, maximum level, cost curve, typed effects, and where they appear. Effects are supported records such as `{ kind: 'multiply', stat: 'analysis.capacity', value: 1.5 }`; code implements the finite supported effect kinds. No arbitrary strings evaluated as code.

Facilities contain ordered paid stages, compatibility tags, acquisition limits, and commissioning conditions. Instruments have task compatibility; a facility stage does not duplicate an instrument when reloaded. Relocation keeps an instrument ID. A successor receives a new ID.

Jobs declare input rates, output rates, staffing/qualification requirements, allocation bounds, and completion conditions. Target definitions declare whether real or fictional, scientific source notes, data type, equipment requirements, time coverage, and permitted claim. Scientific capability gates are independent from economic multipliers.

Validate references, finite/nonnegative values, monotonic curves where intended, unique IDs, valid reset classes, and prerequisite cycles. Distinguish reveal prerequisites from purchase prerequisites. Acyclic definitions alone do not prove economic reachability; integration scenarios handle that.

## 6. Simulation time and deterministic ordering

### Canonical step

Use a fixed **0.25 simulated second** tick. Store elapsed time as an integer tick count. Headless acceleration executes more identical ticks without waiting. A larger speed setting never changes recipe rates or tick size.

The browser uses an accumulator, rendering at approximately 5–10 updates/second. Limit tick work per frame to keep controls responsive. If requested speed exceeds throughput, show actual speed; do not silently skip simulated time. Pause on hidden tabs by default in this prototype. Manual advance controls process exact tick counts.

### Tick transaction

1. Apply queued commands in stable sequence order at the tick boundary. Headless policies use the same boundary convention.
2. Recompute affected modifiers and eligibility from post-command state.
3. Snapshot starting resource inventories, allocations, and capacities.
4. Calculate requested work for each active job, bounded by supported hardware, allocation, and staff.
5. Allocate shared inputs in explicit player-priority order, then stable job ID order. Each allocation reserves inputs from the snapshot; later jobs see the reservations.
6. Apply reserved consumption and resulting outputs together. Outputs from this production phase become available to other jobs next tick.
7. Update fractional job progress and materialize discrete completions: people, publications, paid stages, candidate batches.
8. Evaluate unlocks and one-time rewards in stable ID order. Newly unlocked production begins next tick. Milestone rewards cannot repeatedly trigger.
9. Emit events and update diagnostics.

This introduces a small, explicit one-tick pipeline delay and avoids accidental same-tick compounding based on array order. Priority is intentionally consequential and visible. Equal-priority ordering must be documented; proportional sharing can be added later only if playtests justify it.

### Numerical rules

Use JavaScript `Number`, finite checks, and relative-plus-absolute comparison tolerances in tests. Avoid rounding stored resource stocks for display. Discrete counts remain integers; fractional progress stays in job records. Bound consumption to available inputs. Clamp only tiny negative numerical residue within a declared epsilon; larger violations fail an assertion in development.

Many discrete events use progress accumulation, not a time counter independently granting rewards. Preserve surplus progress only if its inputs were paid. Do not award two cohorts when resources funded one.

The same tick size must give identical outcomes for one long `advanceTicks` call and many smaller calls with the same boundary commands. Alternate tick sizes are an optional convergence experiment, not an expectation of bit-identical continuous-time results.

## 7. Economic implementation contracts

| System | Implementation rule |
|---|---|
| Founder | One free work slot; observes or analyzes; may teach the first course; no simultaneous incompatible tasks |
| Observing | Instruments produce compatible typed D under supported tasks; modifiers improve utilization/output but do not remove scientific capability requirements |
| Analysis | Consumes D once; produces K and linked evidence once; preserves provenance needed for programs |
| Outreach | Telescope/staff allocation creates I up to capacity; recruitment and donation shares total at most one |
| Donations | Non-consuming use of audience allocation; produces recurring F; free basal recovery remains possible |
| Academy | Requires recruitment, seats, F/K, and founder or qualified teacher time; funded progress creates persistent people |
| Teams | Useful completed funded work earns capped X; blocked/idle work and assignment switching earn none |
| Publications | Program completion consumes/reserves eligible evidence and pays P once per instance; P is not spent for grants |
| Grants | Eligibility from current P and office slots; recurring net-positive support at a feasible operating allocation |
| Engineering | Qualified people + F/K create E; paid hardware stages remain through prestige |
| Joint science | Requires explicit complementary datasets; produces C; C upgrades reset while purchased hardware remains |

No unavoidable payroll debt. Active budgets throttle when F is short. Staff remain present and can be reassigned. Zero-F recovery is always available through free startup actions and support, even after prestige.

### Evidence and data inventory

First slice uses four evidence categories: lunar record, planet record, processed image, and variable-star time series. Data must retain target/program association: a global untyped data pool cannot satisfy an unrelated investigation. Implement finite lots with target ID, type, quantity, observation interval, and consumed quantity. Merge compatible adjacent lots to avoid unbounded per-frame records.

Program definitions specify evidence quantities and coverage requirements. Reusing historical facts is allowed; reusing already-allocated observation packets for unlimited publications is not. An analyzed lot may contribute both K and evidence; that is a declared joint output. Completing a repeat program requires fresh eligible evidence.

Use compressed observing epochs for time-series tasks. Wall-clock days and live astronomical events are out of scope. No full light-curve plots are required initially; show sample count, coverage, and progress.

## 8. First playable content: U00–U10

### Starting state

Seed fixture A: 25 F, zero K/I/X/P/L, founding telescope, founder work slot, Moon task revealed. Initial free observing and self-analysis require no cash. The initial manual interaction selects a task and runs it over simulated time; it is not unlimited click-generated money.

### Initial recipe seeds

These values establish units and a runnable model. Tune as a set after the first baseline; they are not a balanced 45-minute campaign.

| Recipe | Starting rate/cost | Gate or constraint |
|---|---|---|
| Founder observing | 1 compatible D/s | Founder plus instrument; free baseline |
| Founder analysis | 1 D/s → 0.2 K/s | Founder cannot observe simultaneously |
| Outreach | 0.1 I/s, capacity 100 | Founder or assigned instrument/staff allocation; tradeoff with observing |
| Donations | 0.02 F/s per donation-allocated I, plus 0.05 basal F/s once outreach opens | Audience retained while allocated |
| Camera observing | 4 D/s at 0.05 F/s | Compatible instrument, tracking, camera, operator/founder task |
| Workstation analysis | Up to 4 D/s → 0.2 K per D at 0.05 F per D | Analyst/founder work allocation |
| First cohort | 20 F + 5 K total over 60 simulated seconds | Recruitment share > 0; one seat; founder teacher |
| Staff Expertise | 0.01 X per useful staffed work-second | Founder excluded; throughput cap from mentoring level |
| Monitoring contract | 0.5 F/s at full delivered monitoring allocation | Photometry, eligible instrument and useful recurring measurements |
| First grant | 2 F/s gross with 0.2 F/s administration | First P, grant office, one slot |

Cohort costs accrue proportionally with funded progress. Enrollment reserves a seat, not all future resources. Pausing preserves paid progress. Subsequent recruitment rate scales with allocated audience and available capacity; do not add a second applicant currency.

### Initial purchase/gate seeds

| ID | Content | Starting costs and conditions | Persistence |
|---|---|---|---|
| U01 | Outreach | First lunar record; 5 F + 1 K | Facility/method retained; I resets |
| U02 | Stable mount, tracking | Moon and planet records; mount 15 F, tracking 30 F + 5 K | Installed hardware/automation |
| U03 | Reflector | Tracking + outreach milestone of 10 cumulative I; 100 F | Instrument |
| U04 | Camera and workstation | Camera 75 F + 10 K; workstation 50 F + 5 K | Hardware; camera requires reflector |
| U05 | Academy | First processed image; 100 F + 20 K | Facility; cohort progress is campaign work |
| U06 | Mentoring/team | First person performs useful work; 50 F + 10 K | Team access retained; operational levels reset |
| U07 | Teaching qualification | First person + mentoring; 10 K + 1 X | Qualification retained |
| U08 | Photometry | Camera + workstation + useful staff assignment; 100 F + 20 K | Method retained |
| U08 | Enclosure project | Photometry revealed; pier 50 F, roof 100 F, controls 100 F + 10 K | Paid stages retained; commissioning gives scheduled-work benefit |
| U09 | First scientific program | Eligible variable-star evidence; 25 F + 10 K plus researcher time | Completion archived; active progress resets |
| U10 | Grant office | First P; 100 F + 20 K | Facility retained; current grants/P reset |
| U10 | Conclude campaign | First P and built grant office | Central prestige action |

Starter lunar record: 10 analyzed D. Planet record: 20 compatible analyzed D. Image milestone: 100 camera D processed. First variable-star program: 300 relevant processed D, three observing epochs, 60 researcher work-seconds. These quantities and seed costs must be checked against the actual implementation before calling the slice balanced.

Personnel include generalists, qualified teachers, researchers and later engineers. The first program accepts founder/generalist researcher work; otherwise qualification prerequisites could create a deadlock. Classroom teaching and telescope operation compete for people. The enclosure is an optional beneficial project before first closure, not a new mandatory first-cycle gate.

Repeatable campaign upgrade families: outreach capacity, acquisition utilization, analysis throughput, cohort capacity, mentoring, and program efficiency. Start with three to five levels each. Candidate cost curve: `base * growth ** level`, with family-specific growth values; candidate level effect around +20–35% in a documented additive category. All constants live in balance data. Do not multiply every bonus indiscriminately.

## 9. Prestige and re-entry implementation

The prestige preview lists gained L, one-time depth bonuses, reset balances/upgrades, retained equipment/people, unfinished work losses, and free restart path. `concludeCampaign` is atomic and available only at U10. Reward the completed campaign once; increment campaign index; create fresh campaign state; then reattach retained lifetime/institution state.

| Retain | Reset |
|---|---|
| Instruments, facilities, installed modules, paid build stages | F/K/X/E/C balances, I, raw queues |
| People, qualifications, methods, tracking/software | Campaign operations, specializations, C bonuses |
| Journal/archive, lifetime unlocks, Legacy upgrades/balance | Current P, grants, active program evidence, cohort progress |
| Assignment preferences and auto-buy rules | Job execution pauses where startup resources are absent |

A retained worker is not automatically productive without a valid task/budget. Finished students remain; unfinished cohort work is listed as lost. Staff assignment preferences can be retained, but startup scheduling must validate them against current resources.

Candidate score: the first completed variable-star program defines `S_first`. Its first family instance gives full score, subsequent instances give weights 1/2, 1/3, etc. Advanced family/depth values rise deliberately. Candidate payout: `floor(4 * sqrt(S / S_first)) + unclaimed depth bonuses`. First reference campaign yields 4 L. Record depth bonuses as claimed only during the successful closure transaction.

First permanent purchases: 2 L for ×2 support income, 2 L for ×2 analysis capacity, or 2 L for ×2 recruitment/training capacity. Later levels have rising costs. These are alternative candidate packages, not fixed final balance.

Rebuild target: exceed the previous campaign's sustained useful production in roughly 5–8 simulated minutes after the first closure. Measure F/K rates and completed-program throughput separately; a high gross Data rate with no useful processing does not count as recovery. No campaign or ending requires a reset count, L purchase, or inaccessible exclusive resource.

## 10. Browser interface

The interface is functional, readable, and deliberately plain. Use semantic tables, native buttons, number inputs/selects, and minimal CSS. No rendering framework.

| Panel | Contents |
|---|---|
| Global summary | Simulated time, campaign, F/K and revealed resources, pause/speed, current objective |
| Central infrastructure | Telescope/enclosure/dome stages as text, costs, prerequisites, operating status |
| Outreach | I/cap, donations vs recruitment allocation, rates and upgrades |
| Analysis | Typed inventories, processing assignments, K output, blocked reasons |
| Academy/team | Population, assignments, cohort progress, X and qualification upgrades |
| Science/grants | Evidence requirements, active programs, P, grant slots and net support |
| Later institutions | Engineering, radio, missions, collaboration appear as implemented/unlocked |
| Prestige | Preview, Legacy shop, retained/reset summary |
| Diagnostics | Rate breakdowns, shortages, recent events, scenario/debug controls |

Disabled purchases explain missing resources and prerequisites. Display costs without implying reliable ETA when a required producer is inactive. Estimated payback is a local estimate based on current throughput; multi-system upgrades may show “requires scenario comparison” instead of a misleading exact number.

Provide 1×/5×/20× speeds, pause, step one tick, advance 10/60 seconds, export/import and scenario restart. More speeds can follow measured performance. A button press issues a command, never edits the underlying state directly. Browser controls and headless policies use the same command validation.

## 11. Save, import, replay and scenario rules

Canonical save envelope includes save schema, content version, balance ID/hash, simulation version, state and seeded RNG state if introduced. Store an autosave periodically and on deliberate pause; export JSON is the reliable portable format. Do not advance through real time while closed.

Validate imported JSON structure and bounds before replacing the active game. Reject unsupported future schema versions with a useful message. Keep the previous save until import succeeds. Treat imported text as data; render labels through textContent.

Same-balance round trips must preserve state and subsequent outcomes. Balance changes are explicit: restart a clean scenario under the new balance by default. A developer-only “rebase checkpoint” can be added later, must mark the run modified, and cannot be silently mixed into comparison reports.

Replays contain initial scenario ID, balance hash, command tick/sequence records and seed. Same initial state/config/commands should reproduce the same canonical state in the supported runtime. Cross-runtime floating-point comparisons may use tolerances; never promise bitwise identity across all platforms.

## 12. Headless runner and policies

Suggested CLI contract:

```sh
node tools/simulate.js --scenario first-cycle --policy milestone --until first-prestige --out reports/baseline
node tools/simulate.js --scenario first-cycle --policy balanced --seconds 7200 --out reports/balanced
node tools/sweep.js --experiment first-cycle-costs --out reports/sweep
```

Options resolve registered IDs, not arbitrary executable code. Output directories contain configuration snapshot, command/event logs, summary JSON and sampled CSV. Stop reasons include objective achieved, time limit, invariant failure, resource deadlock heuristic, and command budget limit.

Policies observe summaries and issue ordinary commands at a fixed one-second simulated decision cadence. The same cadence applies to comparisons; no policy can buy between ticks or see hidden future randomness.

Initial policy set:

- **Milestone:** hand-authored path for reachability and baseline pacing; not claimed optimal.
- **Balanced:** prioritizes current limiting throughput with reserve budgets and milestone purchases.
- **Payback-first:** ranks a supported subset of upgrades by estimated local return; flags upgrades it cannot value.
- **Academy-heavy:** invests earlier in people and teaching while respecting solvency.
- **Prestige-focused:** closes at configured payout/elapsed/depth thresholds.
- **No-reset:** disables prestige and pursues all ordinary gates.

Engineering-heavy and later program-specialist policies arrive with those systems. Compare failed/time-limited runs honestly; do not report them as completed campaigns.

## 13. Metrics and experiments

Collect a sampled row every 5 simulated seconds plus immediate milestone events. Record stocks, gross/net flows, blocked time by reason, allocation/capacity utilization, people, upgrades, S, potential L and campaign depth. Bound in-browser history; headless tooling may stream output.

Required summary: unlock times, first closure time, reset count, time to regain prior useful throughput, ending time, currency-starved time, useful-output ratios, first/old-instrument contributions, policy action count and run stop reason.

Experiment order:

1. Establish a reachable first cycle with the hand-authored policy.
2. Locate long waits and wasted production; identify whether each creates a meaningful purchase choice.
3. Vary acquisition, analysis, outreach and academy costs/rates individually.
4. Compare staffing and purchase policies under identical parameters.
5. Compare closure thresholds and L/minute; ensure trivial opening loops do not dominate deeper campaigns.
6. Test reset benefits and retained-network recovery.
7. Add one later system at a time and repeat.

Use registered nested parameter overrides with startup validation. Begin with small ±10% and ±25% sweeps, not huge Cartesian products. Each report stores its exact overrides. Separate simulated completion time from real execution performance. Automated policies are diagnostic tools, not proof of optimal play or fun.

## 14. Validation strategy

| Test group | Required behavior |
|---|---|
| Definitions | Duplicate/missing IDs, unsupported effects, invalid reset classes, cycles and nonfinite values fail |
| Commands | Invalid actions are atomic; successful actions charge once and cannot exceed staff/capacity |
| Accounting | Data consumed once; evidence/publications not duplicated; resources finite/nonnegative |
| Scheduling | Shared inputs honor explicit priorities; same-tick outputs unavailable until next production tick |
| Staffing | Founder/people cannot double-book; qualifications persist; idle work earns no X |
| Training | Partial funding produces partial progress; complete cohort creates integer people exactly once |
| Programs | Correct type/target/coverage; fresh evidence for repeated programs; rewards once |
| Funding shortage | Work throttles without debt; recovery succeeds from zero F |
| Persistence | Every upgrade/resource follows its declared class; construction and people survive |
| Prestige | Preview matches transaction; payout once; depth bonus once; re-entry reachable |
| Reproducibility | Chunked and unchunked same-tick advancement with same commands agree |
| Save/replay | Round trip, continuation, invalid imports, and version mismatch handling |
| Reachability | U00–U10 scripted scenario; subsequent reset recovery; later full/no-reset scenarios |
| Browser smoke | Purchase, assignment, speed, pause, import/export and preview behave consistently |

Use node:test for core/integration checks. Browser smoke testing can initially be manual with a short reproducible checklist. Add browser automation only if regressions justify the dependency. Assert behavior and invariants rather than snapshots of entire UI output or formulas copied into tests.

A suspected stall is not proven deadlock: identify reachable productive actions and record the heuristic. Mandatory reachability scenarios provide stronger evidence for the paths they exercise, not proof for every imaginable allocation.

## 15. Ordered implementation work packages

| Package | Work and dependencies | Acceptance gate |
|---|---|---|
| P0 Skeleton | ES modules, scripts, static server, checking, test entry; no prerequisites | Browser loads; Node imports core; type check/test command work |
| P1 Definitions/state | Resource/upgrade schemas, validation, initial state, serialization; P0 | Invalid definitions fail; valid starter state round-trips |
| P2 Simulation kernel | Tick ordering, reservations, commands, rates, events; P1 | Atomic spending and deterministic chunked advancement tests pass |
| P3 Starter economy | Founder, observing, analysis, outreach, tracking, reflector/camera; P2 | Script reaches image milestone; zero-F recovery works |
| P4 Plain playable UI | Summary, purchases, jobs, speed/pause, explanations; P3 | Human can reproduce P3 scenario without console edits |
| P5 Academy/team | Cohorts, anonymous staff, mentoring/X, teacher qualification; P3–P4 | Training/assignment invariants pass; player sees teaching tradeoff |
| P6 Programs/grants | Photometry, coverage, evidence, Publication, grant office; P5 | U10 reachable; no requirement depends on its own reward |
| P7 Prestige | Score, preview, persistence, Legacy purchases, restart; P6 | One full cycle and faster recovery work; losses match preview |
| P8 Experiment tooling | Policies, scenario runner, metrics, override sweeps, saves; P7 | Reproducible comparative report with valid stop reasons |
| P9 First-cycle tuning | Play and simulate; adjust seed numbers; P8 | No major deadlock or dominant trivial reset; first slice decision gate |
| P10 Network/engineering | U11–U15, candidates, follow-up, E, dome/build stages, spectroscopy; P9 | New producers change earlier priorities; old gear contributes |
| P11 Radio/space | U16/U16R/U17A/U17B; qualified mission work, separate spacecraft; P10 | Distinct paid stages and commissioning; useful first-orbit period |
| P12 Joint science/ending | U18–U20, C upgrades, final evidence programs; P11 | Complete prestige and no-reset policy scenarios under documented limits |
| P13 Balance review | Full sweeps, human sessions, limitations and next decisions; P12 | Evidence-backed decision to revise economy or begin visual implementation |

Implement packages sequentially when dependencies require it. Avoid broad refactoring while numerical assumptions are still moving. Each package should leave a runnable slice and a short record of what was learned.

## 16. Completion criteria and handoff

### First-cycle prototype accepted when

- A person can play from new save to prestige using the UI.
- F, D, K, I, people, X, P and L have distinct useful roles.
- At least two production bottlenecks require different remedies.
- Academy investment and staffing produce a visible tradeoff and later return.
- The original telescope contributes after the reflector arrives.
- Prestige creates a clearly faster next campaign without deleting the institution.
- A clean automated run reproduces the same path and reports timings.
- Core checks pass and unresolved balance concerns are documented.

### Full numerical prototype accepted when

- The nine central infrastructure stages are represented as working states with paid projects, including radio, first orbit and a separate infrared flagship.
- Institutions have separate functional panels, even though they have no artwork.
- Surveys, engineering and C production materially change earlier-system economics.
- Completion is reachable with prestige; a documented no-reset run demonstrates ordinary-resource access or reports the remaining reachability issue explicitly.
- Three-to-five-reset and 5–7-hour pacing targets have measured results; unmet targets are labeled rather than claimed achieved.
- Space missions have meaningful operating gameplay before the ending.
- Balance definitions, scenarios, reports and limitations are ready for the next implementation decision.

Handoff includes source, README, pinned tool versions, final balance snapshot, representative saves/replays, passing test results, baseline/policy comparison reports and a short balance findings note. Graphics and engine selection begin only after reviewing that evidence.

## 17. Technical and design risks

| Risk | Response |
|---|---|
| Too much prototype infrastructure | Build the first playable cycle before generalized reporting or advanced policies |
| Economic bonuses undermine science | Separate hard compatibility from productivity modifiers |
| Retained hardware makes reset meaningless | Measure campaign multiplier share and recovery; adjust operations, not erase telescopes |
| More currencies only add waiting | Require every new resource to introduce allocation and strengthen an earlier producer |
| Early numerical seeds imply false precision | Label baseline, run it, report measurements before tuning claims |
| Tick priority creates starvation | Expose priority and shortages; test funding recovery and input allocation |
| Headless policy appears optimal | Compare several strategies and manual sessions; report policy limitations |
| Save rebasing contaminates experiments | Exact config identities, explicit modified-run flag, clean scenario reruns |
| Scope exceeds a short game | Treat lifetime pacing as a hypothesis; cut redundant upgrades before padding production |

The next executable task is P0–P3: establish the shared deterministic model and a reachable starter economy. The first substantive design verdict comes after P7–P9, when a complete prestige cycle can be played and measured.
