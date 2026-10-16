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
5. Install a stable mount and tracking. Research Saturn and its moons (×3), build
   the reflector/camera, then research star clusters (×5) to reveal the Academy.
   Nebula imaging (×8) is an optional later discovery.
6. Train graduates and permanently appoint them at whichever station needs growth.
   The first graduate reveals Research regardless of their appointment.
7. Use Research's mentoring programs to produce Expertise. Expertise improves
   operating efficiency; Knowledge buys scientific capabilities and target unlocks.
8. Develop photometry in **Scientific programs**, prepay a variable-star study,
   then use its Publication to open grants in the Support office.

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

A course costs **8 Funding + 3 Knowledge + 4 Interest**, paid up front. One classroom
supplies 1 work/s toward 40 work. A teacher adds 1 base work/s, reducing passive
course duration from 40 to 20 seconds. At the first passive Funding/Interest rates,
each course's F/I costs replenish in 20 seconds. Additional teachers need stronger
enrollment income to realize their full sustained benefit.

Teaching assistance gives 0.25 base work per action, up to four actions per simulated
second: approximately 20 seconds/course while held, or 13.3 seconds with one teacher,
before teaching-practice bonuses. The Academy explains whether passive teaching or
enrollment income currently limits sustained recruitment. Savings and active help
can temporarily overcome income limits. Enrollment remains an explicit button.

Each appointment uses one unassigned graduate and cannot be reversed. Total trained
population stays intact. Observers add capacity to the whole observing network;
analysts, educators, fundraisers and researchers add their station's currency.
Qualified teachers add course speed. No particular first appointment is mandatory.

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
Schema **8**, simulation **0.9.0-insight**, identifies P7. The exact bundled P6
programs save and the preceding single-Data save upgrade automatically: resources,
producers, people, appointments, discoveries and paid work are preserved. They
start with zero Insight and no permanent modifiers. Earlier economies
or other configurations remain protected with an export option until an explicit
fresh run. New-run replacement also keeps a previous-economy local backup.

## Scientific programs and grants (P6)

After Research and camera equipment, **Develop photometry** costs 30 Knowledge.
This opens an independent scientific workspace with 1 study work/s. A variable-star
study costs **500 Data + 20 Knowledge + 15 Funding**, paid in full upfront, and
requires **60 work**. It completes automatically with **one Publication**. Repeats
pay the full price for a new sample; no typed Data or evidence inventory is added.

One study runs at a time, alongside observations, archive research, outreach,
teaching and mentoring. Hold **Work on the study** for 0.25 base work/action.
**Appoint scientist** uses one unassigned graduate to add 1 base work/s, reducing
the passive study duration from 60 to 30 seconds. Scientific-practice upgrades
spend Expertise to increase both passive and active study work. No researcher or
grant is required for the first study, so the unlock has a bootstrap path.

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
lost, plus unfinished prepaid course/study progress. **Keep this run** cancels;
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
| Institutional memory | 2 Insight | ×2 teaching, Expertise and scientific-study progress, including help |
| Connected thinking | 1 Insight | ×1.25 all seven production categories, including instant analysis |

Insight factors multiply the current run's local bonuses and compound across
levels. **Only purchased Insight modifiers and unspent Insight persist.** The run
number and earned-point accounting are metadata, not retained production. Restart
prototype separately confirms erasing even permanent Insight; prestige preserves it.

## Verification and status

```sh
npm run check
node --test test/stations.test.js
npm run scenario:stations
npm run scenario:prestige
```

The existing single progression test now follows the network through a full reset,
shop save/reload and faster rebuilding. It checks that paid unfinished work is
listed and discarded, every ordinary state partition resets, rewards/Insight spending
survive reload, and the same policy rebuilds faster. No broad new suite was added.
Existing server/import smoke checks remain available through `npm test`.

The scripted ordinary-command path reaches the Academy at **438.25 simulated
seconds**, its first Publication at **670 seconds**, and two Publications/two grants
at **700 seconds**. A scientist reduces the second study from 60 to 30 seconds;
Funding grows from 2.2 to 6.2/s while Data remains 144/s. These measure one policy,
not optimal play or final balance. Larger facilities, mountain observatories,
radio and spacecraft remain planned content.

The prestige scenario starts from that completed network, demonstrates losses using
unfinished paid work, earns 5 Insight and buys observing, shared enthusiasm and
connected thinking. The same P6 policy takes **380 simulated seconds** in run two,
versus **700 seconds** initially; Academy returns in **173.25 seconds**, versus
438.25 initially. It is one policy and upgrade choice, not an optimality claim.

The browser and headless scenario share a runtime-neutral deterministic core.
Commands are `performStationAction`, `buyInvestment`, `processData` (quantity only),
`enrollCourse`, `startProgram`, `beginPrestige`, `buyInsightUpgrade`, and
`startNextRun`; quotes and purchase previews are read-only. There are no DOM,
storage, timer or Node dependencies inside the core.

See the [game design](eyes-on-the-universe-game-plan.md),
[implementation plan](eyes-on-the-universe-prototype-implementation-plan.md), and
[findings and resolution record](findings.md).
