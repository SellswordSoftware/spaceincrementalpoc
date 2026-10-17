# Eyes on the Universe

An incremental astronomy prototype with independent stations, a single Data wallet,
and permanent production investments. Research new targets, add telescope capacity,
and use other stations to accelerate the growing observatory network.

## Run locally

Use Node.js **24.16.0**, pinned in `.node-version` and `.nvmrc`.

```sh
npm ci
npm run dev
```

Open <http://127.0.0.1:5173>. Set `PORT` for another port. No framework, bundler,
backend, artwork pipeline or runtime dependency is required.

## The opening loop

1. Click/hold **Observe the sky**. Spend 5 Data to establish an observing routine,
   automating the founding telescope at 1 base Data/s.
2. Open Analysis for 10 Data. **Analyze 10** spends Data for immediate Knowledge;
   **Expand archive research** spends 25 Data initially for 0.2 base Knowledge/s
   permanently. Repeat archive investments have rising prices.
3. Spend Knowledge to open Outreach. Share the sky or add standing activities to
   earn Interest. Spend Interest on permanent supporter groups in the Support office.
4. Research Jupiter for 8 Knowledge: the observing frontier rises from ×1 to ×2,
   increasing the same Data stream and active observing. Buy additional telescopes
   with Funding to increase the capacity benefiting from that frontier.
5. Install tracking and open the Engineering workshop. Research Saturn (×3),
   build a reflector and permanent enclosure, then install the camera and research
   star clusters (×5) to reveal Academy. Engineering already produces while these
   other stations grow.
6. Train graduates and permanently appoint them at whichever station needs growth.
   The first graduate reveals Research regardless of their appointment.
7. Use Research's mentoring programs to produce Expertise. Expertise improves
   operating efficiency; Knowledge buys scientific capabilities and target unlocks.
   Research also enables the robotic dome, the next physical observatory milestone.
8. Develop photometry in **Scientific programs**, let its research team publish automatically,
   then use its Publication to open grants in the Support office. Research nebulae
   (×8) to unlock observatory expansion and meet the discovery requirement for prestige.

**Data/s = installed observing capacity × frontier yield × equipment/practice bonus.**

There are no typed Data balances, evidence inventories or target assignments.
Discoveries are permanent upgrades recorded in the journal. A frontier upgrade
represents network scientific productivity, not a claim that each small telescope
can directly observe every frontier object. Older equipment remains productive.

Each station shows local output, passive rates, owned producers, action yield,
prices and the actual marginal gain after bonuses. Active assistance benefits
from appropriate equipment/practice upgrades. Analysis methods and workstations
improve both passive Knowledge and instant Knowledge per Data. Passive producers
need no recurring wallet inputs and no salaries.

**Next unlock** follows real progression gates. **Optional investment** suggests
ways to grow without prescribing a specific archive purchase or staff appointment.
The Data breakdown separates capacity, frontier and bonuses. A single common
archive-research family replaces the previous lunar/Jupiter/imaging studies.

## Academy and permanent staff

Opening the academy includes a classroom that automatically produces one base
graduate every **40 seconds**. **Establish teaching team** permanently appoints one
qualified graduate and adds another independent classroom. Initial stock cost:
**30 Funding + 10 Knowledge**, tripling per extra team (30, 90, 270, 810 Funding); graduate cost stays one.
The Academy unlock costs **80 Funding + 15 Knowledge + 4 Interest**.

Teaching practice and Insight increase rewards per completion, keeping timers fixed.
Fractional graduates carry into future completions; only whole people can be appointed.
Each classroom shows its progress and remaining time. There are no course purchases,
teaching assistance, restart clicks or recurring tuition.

Each appointment uses one unassigned graduate and cannot be reversed. Observers add
observing capacity; analysts, educators, fundraisers and researchers add local currency.
Teaching/scientific teams add parallel timed producers. The first classroom continues
working regardless of where graduates are appointed.

## Time and saves

Fresh runs start live. Click/hold works with mouse, touch and Space/Enter. Assistance
is bounded to four actions per simulated second; only one station is actively
helped, while passive output continues everywhere. Release, cancellation, loss of
focus, pause or hiding the page ends the hold.

Run/Pause, 1×/5×/20×, +10 s and +60 s are prototype utilities. All advance the same
0.25-second ticks. Hidden tabs pause and closed tabs earn no progress. Reload
restores paused. No held input is saved.

Local saves occur on purchases, every five seconds and page exit. Export/import
uses the shared versioned serializer. Failed imports leave the current run intact.
Schema **13**, simulation **0.14.0-progression**, identifies the progression revision.
Exact P12 saves migrate with their entire state unchanged, including existing people,
classrooms, Insight levels, timers and completion. Revised yields/prices apply going
forward; nothing already purchased is removed.
The exact P11 save upgrades with empty joint-science state and every previous
wallet, purchase, timer phase, mission result, fractional reward and Insight intact.
The exact P10 save upgrades with empty mission state, preserving all previous
resources, purchases, timer phases, fractional rewards and Insight.
The exact prior parallel save upgrades with its entire state unchanged, including
Insight, timer phases and fractional rewards.
Exact bundled P5–P7 saves upgrade automatically, preserving resources, purchases,
people, Publications and P7 Insight. Existing teachers/scientists become teams;
unfinished paid work becomes progress on the founding timer, capped below completion.
No rewards are awarded during migration. Older/custom configurations keep the
export/new-run fallback and previous-economy backup. Timers and fractional rewards
persist; reload resumes paused.

## Scientific programs and grants (P6)

After Research and camera equipment, **Develop photometry** costs
**500 Data + 30 Knowledge + 15 Funding** and includes the founding research team.
Each team automatically produces one base Publication every **60 seconds**, repeating
without additional spending. **Establish research team** permanently appoints one
graduate and adds another timer. Initial stock cost: **500 Data + 20 Knowledge +
30 Funding**, growing ×1.6 per extra team. Graduate cost stays one.

Scientific practice and Insight increase Publications per completed cycle, keeping
timers fixed. Fractional rewards carry forward; whole Publications open grant slots.
There are no study-start buttons, active study assistance or recurring costs.
All observing, teaching and other producers continue independently.

The first Publication reveals **Open grant office** in Support (50 Funding +
10 Knowledge). **Secure observing grant** initially costs 20 Funding + 5 Knowledge
and adds 2 base Funding/s without upkeep. Each Publication backs one grant slot;
Publications are not spent. More published studies open more slots. Grant prices
increase on repeat purchases. Support shows active grants, total slots and the
reason a further purchase is blocked.

The first result and grant replace the previous end-of-prototype objective.
P7 adds the full prestige transition and Insight shop described below.

## Full-reset prestige and Insight (P7)

Research the **nebula frontier** and **secure an observing grant** to become
eligible. Review prestige from the time-control bar. Review pauses the game and
shows the live reward, all resource balances and ordinary purchases that will be
lost, plus classrooms, research teams, timer progress and fractional rewards. **Keep this run** cancels;
**Export this run first** saves a portable checkpoint.

**Reset everything & earn Insight** commits the reset. All ordinary currencies,
producers, stations, target unlocks, discoveries, telescopes, equipment, staff,
appointments, qualifications, Publications, grants and unfinished work reset.
The new run has only the free backyard telescope, Moon baseline and starting
balances. Permanent-within-run investments must all be rebuilt.

The first eligible run earns **4 Insight**. Additional Publications add diminishing
rewards: **2 Publications → 5 Insight; 5 → 6; 10 → 7**. Formula:
`4 + floor(sqrt(max(0, Publications - 1)))`. Eligibility is required regardless of
that count. The preview shows the next Publication threshold. Reward values are
prototype seeds, not final tuning.

After committing, the game stays paused in the **Insight shop**. Buy permanent
modifiers with buttons, then **Begin run 2** (or the subsequent run). Prices double
per level. Ordinary game actions and time advancement cannot run in the shop.
Reload/import restores the shop without re-awarding points. Unspent Insight can
be saved and spent at a future prestige; upgrades are purchased only between runs.

| Modifier | First cost | Permanent effect per level |
|---|---:|---|
| Expansive observing | 2 Insight | ×2 passive Data and observing assistance |
| Clear analysis | 2 Insight | ×2 passive Knowledge and instant Knowledge/Data |
| Shared enthusiasm | 2 Insight | ×2 Interest and Funding, including active help |
| Institutional memory | 2 Insight | ×1.2 graduate rewards; ×2 Expertise and Publication rewards |
| Connected thinking | 1 Insight | ×1.05 graduate rewards; ×1.25 other production and cycle rewards; timers stay fixed |

Insight factors multiply the current run's local bonuses and compound across
levels. **Only purchased Insight modifiers and unspent Insight persist.** The run
number and earned-point accounting are metadata, not retained production. Restart
prototype separately confirms erasing even permanent Insight; prestige preserves it.

## Engineering and ground observatories (P10)

After motorized tracking, **Engineering workshop** appears.
**30 Funding + 15 Knowledge** opens its founding bench at **0.15 Engineering Progress/s**.
No prestige, graduate, Research institute or grant is required. Add benches
or permanently appoint engineers to grow production. Stock prices rise with each
purchase; engineers always require one graduate. Expertise buys engineering practice.
Click/hold **Develop instruments** for extra Engineering Progress while all other
stations continue. Connected thinking now includes Engineering production/help.

Use Engineering Progress, Funding and Knowledge in the Observatory to build:

| Facility | Initial cost | Added base capacity |
|---|---|---:|
| Permanent enclosure, after reflector | 10 E + 60 F + 15 K | 4 |
| Robotic dome, after Research | 40 E + 160 F + 40 K | 8 |
| Expanded observatory, after nebulae + a Publication | 160 E + 640 F + 160 K | 16 |
| Mountain telescope, after galaxy research | 240 E + 1600 F + 320 K | 32 |

Every earlier instrument continues producing. An architectural diagram, facility
milestones and telescope count show the network growing. Expanded facilities open
**galaxy imaging** (150 Knowledge, ×13 frontier); the mountain telescope opens
**galaxy-cluster imaging** (300 Knowledge, ×21).

Optional science branch: after the robotic dome, develop a **spectrograph** in
Engineering (20 E + 40 K), then **stellar spectroscopy** in Science (40 K).
It adds +100% of base Publications per cycle; every team's 60-second timer keeps
its phase. No repeated sample costs or recurring spending are introduced.

All Engineering resources, facilities, instruments and new discoveries reset at
prestige. First-prestige requirements and Insight payout are unchanged.

## Radio astronomy and space missions (P11)

After the mountain telescope and galaxy-cluster frontier, **Radio observatory**
reveals. The first dish costs **600 E + 3,200 F + 600 K** and adds 24 base Data capacity.
Extra dishes add 12 capacity with escalating prices. **Research radio sources** in
Analysis (250 Knowledge) raises the frontier to ×34 and reveals Space missions.
Optional **Radio timing** in Science improves cycle Publication rewards.

Build each space telescope using one-time Engineering, Funding and Knowledge purchases:

| Mission | Construction sequence | Automatic production after commissioning |
|---|---|---|
| First optical orbital telescope | Space program → platform → optical payload → launch/commission | +48 base Data capacity; one base Publication per 60 seconds |
| Infrared flagship | Infrared program → mirror/payload → thermal shield → launch/commission | +96 base Data capacity; two base Publications per 60 seconds |

The first spacecraft supports **transit targets** (×55 frontier). Its first completed
science cycle and the transit frontier unlock the flagship program; commissioning
does not award an instant result. The flagship supports **infrared fields** (×89),
then **early-galaxy deep fields** (×144) after its first science cycle.

Each mission has its own timer, completed-cycle counter and fractional Publication
bank. It repeats automatically without spending Funding or Data. Science practice
and Insight increase rewards, keeping cycles at 60 seconds. Earlier ground teams
and the first spacecraft keep publishing while the flagship works. Orbital-monitoring
research is another optional cycle-reward improvement. All Data enters the existing
shared wallet; Radio/Space display their own contribution to network Data production.

The network diagram accumulates radio and orbital instruments. Mission panels show
construction status, remaining cycle time, results and fractional rewards. Both
missions, dishes, construction and discoveries reset at prestige. Existing Insight
rules and first-prestige requirements remain unchanged.

## Joint science and the ending (P12)

Your first orbital result reveals **Joint science**. Open the center for
**100 Engineering + 600 Funding + 500 Knowledge**, then establish complementary
programs with one-time purchases:

| Program | Required capabilities | Base rewards every 60 seconds |
|---|---|---|
| The changing sky | Photometry + radio timing | 1 Collaboration Credit + 2 Publications |
| Worlds in context | Orbital monitoring + stellar spectroscopy + transit frontier | 2 Credits + 3 Publications |
| Light across time | Mountain telescope + first infrared result + deep-field frontier | 3 Credits + 4 Publications |

Each program has an independent automatic timer. Science bonuses improve
Publications; Expertise-funded collaboration practice and Connected thinking improve
Credits. Fractional rewards carry forward and timers stay fixed. There are no
recurring costs or restart clicks. Credit purchases improve network observing,
analysis, Engineering and science, with escalating prices.

Once every program has returned a result, **Begin final network synthesis**:
**1,000,000 Data + 1,500 Funding + 2,500 Knowledge + 200 Engineering + 20 Credits**.
The final **90-second** project runs while every station continues. Its completion
pauses the browser and shows the ending. **Keep observing** resumes production;
prestige remains available. Reload preserves the ending, and completion fires once.
All joint progress, Credits, upgrades and the completion record reset at prestige.

## Verification and status

```sh
npm run check
node --test test/stations.test.js
npm run scenario:stations
npm run scenario:prestige
npm run scenario:engineering
npm run scenario:horizons
npm run scenario:synthesis
npm run scenario:progression
```

The existing single progression test now follows the network through a full reset,
shop save/reload and faster rebuilding. It checks that in-flight timers and fractional rewards are
listed and discarded, every ordinary state partition resets, rewards/Insight spending
survive reload, and the same policy rebuilds faster. The same test continues through Engineering, spectroscopy, new frontiers and a
further full reset. No broad new suite was added.
Existing server/import smoke checks remain available through `npm test`.

Every system and the ending are reachable without prestige. Research/equipment
and completed scientific results still gate related capabilities; earned Insight
or reset count never gates content. Later facility/radio/space prices rise more
steeply, giving a choice between saving, expanding income and resetting for Insight.
The next-milestone advice estimates saving time at current passive income and
mentions optional prestige when it is available. Active help and instant analysis
can shorten that estimate.

The current reference first run opens Engineering at **331.5 simulated seconds**,
builds the enclosure at **431.5**, opens Academy at **556.5**, adds the dome at
**665**, expands at **986.5** and builds the mountain telescope at **1186.25**.
The same scripted policy completes the ending without prestige in **5516 seconds**.
With one 5-Insight reset, the rebuilt run finishes in **3512.75 seconds**, or
**4399.25 seconds including the initial run and reset**. These are example policies,
not optimal play or final balance. The +time and 20× utilities remain available
for fast prototype playtests.

Classroom prices triple per expansion. Teaching practice now adds **25% of base
rewards** per level; teaching Insight factors are deliberately milder than other
production modifiers. Classroom and science timers remain **40/60 seconds**, and
the final synthesis remains **90 seconds**. Existing people and purchased levels
are retained when migrating. No population cap or operating costs were added.

The browser and headless scenario share a runtime-neutral deterministic core.
Commands are `performStationAction`, `buyInvestment`, `processData` (quantity only),
`beginPrestige`, `buyInsightUpgrade`, and
`startNextRun`; quotes and purchase previews are read-only. There are no DOM,
storage, timer or Node dependencies inside the core.

See the [game design](eyes-on-the-universe-game-plan.md),
[implementation plan](eyes-on-the-universe-prototype-implementation-plan.md), and
[findings and resolution record](findings.md).
