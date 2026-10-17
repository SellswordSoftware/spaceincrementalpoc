# Eyes on the Universe — Prototype Implementation Plan

Version 2.1 — 2026-10-17 — prestige pacing

## Prestige pacing revision — 2026-10-17

Target the first attractive prestige around **10 minutes at normal 1× speed**, with
no time gate. Complete the founding network: nebula frontier, one observing grant
and robotic dome. This is the earliest intended reset decision; the expanded
observatory is the first major economic cost step. All later capabilities remain
reachable without any prestige. Keep Academy timers and continuous science intact.

Preserve the quick opening through tracking/workshop. Increase the reflector and
enclosure costs ×3, camera and Academy ×4, Research ×3, photometry ×4, workstation
×3, robotic dome ×6 and nebula research ×5 relative to the preceding balance.
The expanded observatory costs 1,280 Engineering + 5,120 Funding + 1,280 Knowledge.
Then increase costs more steeply by tier: mountain ×12, radio ×20, optical orbital
stages ×40–60, infrared stages ×60–100. These are per-item changes from the previous
balance, not multipliers applied again on load or prestige. Local repeatable growth
still costs increasing amounts; global Insight multipliers make rebuilding and
later investment faster.

Research/flagship grants now yield 4 / 8 base Funding per second and their stock
prices grow 80% per purchase, preventing late Funding from overwhelming all prices.
Publications remain useful: mountain 30, radio 100, space program 200, orbital
commissioning 400, infrared program 1,000, infrared commissioning 2,000, deep-field
research 3,000 and synthesis 5,000. Joint programs unlock at 400 / 800 / 3,000;
network integration qualifies at 1,000. Synthesis costs 100 million Data, 1 million
Funding, 100,000 Knowledge, 100,000 Engineering and 500 Credits; payment completes it.

Prestige pays 5 base Insight plus the existing diminishing Publication bonus.
Engineering heritage costs 2 Insight initially and doubles Engineering and
Collaboration output per level (prices double; six levels), making construction
and coordinated production directly improvable through prestige. Other modifiers
keep their current effects and prices.

Suggest prestige when eligible, before the first expansion, if its remaining
Funding/Engineering saving time at current passive rates is at least five minutes.
Show the saving estimate with options to invest or rebuild. This is an economic
nudge, never an automatic reset, countdown, forced modal or content gate.

`scenario:pacing` uses ordinary commands, reinvestment, instant analysis and active
assistance at the normal four-click-per-second cap. The measured first network is
566.5 seconds (9:26.5), awarding 6 Insight; spending two each on Engineering heritage,
Shared enthusiasm and Institutional memory rebuilds it in 309.25 seconds (5:09.25).
These are reproducible reference-policy measurements, not an optimal-play bound or
a promise that every player reaches prestige at exactly ten minutes. The user's
previous 20-minute completion was at 1× without time skips. Validate this new curve
with another human playtest before selecting later reset or total completion targets.

Preserve existing saves exactly; only future prices/rates/requirements change.
The continuous-production state shape remains schema 14 with a new configuration
version and explicit migration of the preceding bundled fingerprint. No extra
Insight is retroactively awarded. Keep one progression test with timing assertions.

## Prior resource relationships revision — 2026-10-17

This revision supersedes earlier science-cycle and finale-countdown contracts.
The newer prestige pacing revision above supersedes its numeric costs/thresholds.
Academy retains independent 40-second classrooms. Ground research, commissioned
space telescopes and joint teams instead generate fractional Publications and
Collaboration Credits continuously. Production has no upkeep or restart clicks.
Practice, staff, methods and Insight increase rates. Final synthesis completes
on payment; waiting belongs to earning its resources, not a separate countdown.

Publications remain a cumulative, unspent scientific record. Totals qualify the
network for advanced grants (15 / 100), facilities, missions, joint programs and
the ending (750). All grant tiers share floor(Publications) slots; higher tiers
provide more Funding per purchase. Expertise funds required advanced calibration,
orbital operations, infrared calibration and network integration. Research capacity
therefore supports physical progression throughout the run. Joint teams can be
added repeatedly, consuming one graduate plus rising upfront resource costs.
Collaboration Credits improve the network and are required for synthesis.

Newly available options receive a persistent gold station icon, an “N new” review
button and individual row markers. Availability means prerequisites and Publication
milestones met, independent of affordability. Focusing or clicking a row reviews
it without buying; the station button jumps to the next new option. Save this
review state, reset it at prestige, and never mark repeat purchases or affordability
changes as new. Unlock feedback names the option and destination station.

Migrate existing production progress into accrued fractional rewards; preserve
wallets, purchases, existing graduates, classroom phases, Insight and completed endings.
Grandfather existing joint teams with dedicated staff, preserving the previous
unassigned graduate count. An
already-paid final synthesis completes on migration. No prestige gates. Overall
pacing remains deliberately untuned. Validate one ordinary-command first-run route,
continuous rewards, research/publication links, discovery markers and full reset;
keep tests minimal rather than adding edge-case suites.

## Earlier design and milestone history

The sections below record prior implementation decisions. The resource relationships
revision above is authoritative where science timers, result gates, grant tiers or
final synthesis differ.

### Progression revision — 2026-10-17

Prestige is an economic choice, never a capability requirement. Every system and
the ending are reachable in run one. Equipment/research/results still gate their
related capabilities. Insight makes rebuilding and pushing through rising prices
faster; no unlock or guidance path checks earned Insight or prestige count.

Spread physical growth through the run: tracking opens a small workshop (30 F +
15 K, 0.15 E/s); a reflector permits an enclosure (10 E + 60 F + 15 K); Research
and the enclosure permit a robotic dome (40 E + 160 F + 40 K); nebula research and
the first Publication permit expansion (160 E + 640 F + 160 K). Galaxy research
then permits the mountain telescope (240 E + 1600 F + 320 K). Older instruments
continue contributing. Engineering benches and staff remain optional growth paths;
Expertise is required for practice improvements, not the workshop bootstrap.

Radio and space construction prices increase more steeply by stage, creating
longer saving decisions relative to an established network's income. Keep the
40/60/90-second producer/finale timers; economic waits, not shortening timers or
prestige requirements, determine when resetting looks attractive. Show an estimated
saving time for the next milestone alongside the option to invest or prestige.

Classroom stock costs triple per added team (30/90/270/810 Funding and
10/30/90/270 Knowledge). Each still appoints one graduate. Teaching practice adds
25% of base rewards per level. Institutional memory multiplies graduate rewards
by 1.2 per level while retaining ×2 Expertise/science; Connected thinking gives
×1.05 teaching per level while retaining ×1.25 elsewhere. These tuned modifiers
are explicit in the Insight shop. Preserve all purchased levels, earned people,
classrooms, timer phases and unspent Insight in existing saves; apply revised
prices/yields to future production. No new applicant/population cap or upkeep.

Verify the whole route without prestige using the ordinary commands, compare it
with the same route after Insight, and keep the existing single integration test.
Retain deliberately fast prototype pacing; numerical values remain playtest seeds.

## Parallel production revision — 2026-10-16

Automatic parallel producers replace the former prepaid course/study system.
Keep the fast prototype pacing; defer general pacing reductions until later playtests.

- Opening the Academy includes one automatic classroom. Each classroom runs its own
  repeating 40-second timer and produces one base graduate per completion.
- A qualified teaching team adds one classroom. Initial cost: one available graduate,
  30 Funding and 10 Knowledge. Funding/Knowledge prices triple per team; the
  graduate requirement stays one. Appointments remain permanent within a run.
- Developing photometry includes the first automatic variable-star research team.
  Its upfront unlock costs 500 Data, 30 Knowledge and 15 Funding. Each team runs
  an independent repeating 60-second timer for one base Publication per completion.
- An additional research team costs one graduate, 500 Data, 20 Knowledge and
  30 Funding initially. Stock costs grow ×1.6 per team; the graduate cost stays one.
- No enrollment, study restart, teaching/study assistance, recurring tuition,
  wages or automatic wallet spending. Interest continues funding supporter groups;
  Academy entry also uses a one-time 4 Interest recruitment cost.
- Teaching/scientific practice and permanent Insight increase cycle rewards, never
  shorten these timers. Fractional rewards carry across completions in each station;
  only whole graduates/Publications enter spendable totals. Use the bonus at completion.
- Adding a producer starts its timer at zero without changing existing timers.
  Display each producer's progress, remaining seconds, reward multiplier, fractional
  reward bank and average production rate. Timers and fractional banks save/reload.
- Prestige removes every classroom, team, timer and fractional reward, alongside all
  existing ordinary progress. Insight retains its existing reset/shop rules.
- Migrate exact bundled P5–P7 saves: preserve economic state and Insight, convert
  existing teachers/scientists into parallel teams, and carry unfinished work into
  the founding timer. No rewards on migration. Keep nonmatching saves exportable.
- Adapt the existing single progression test: automatic repeated rewards, staggered
  timers unaffected by additional capacity, unchanged durations under practice/Insight,
  no recurring wallet debit, fractional carry, save/reload and full reset/rebuild.

## 1. Authority and status

Implement [game design draft 1.2](eyes-on-the-universe-game-plan.md). The opening
station correction is implemented through academy/research, including the
[findings](findings.md): single Data, target frontier, consolidated Analysis,
scaled active help, real unlock guidance and revised academy pacing. P6 adds photometry, Publications and grants; the P8 correction replaces prepaid work with parallel automatic cycles.
Player review accepted several prestiges and the revised timers. P10 adds Engineering/facilities; P11 adds Radio/space; P12 connects them with repeating joint programs, Collaboration Credits and a finite synthesis ending.

Earlier typed-Data, evidence, allocation and exclusive-founder requirements are
superseded. [Previous implementation plans](docs/design-history/implementation-plan-before-station-revision.md)
are historical context, not additional acceptance criteria.

## 2. Keep the technical base

JavaScript ES modules, strict JSDoc checking, plain DOM, fixed 0.25-second ticks,
runtime-neutral core, atomic commands, read-only summaries/quotes, local JSON saves
and headless Node scenario. No framework, engine, backend or new runtime dependency.
Costs/content remain separate from presentation. No new generic simulation framework.

## 3. Current economic contracts

- Data is a numeric stock alongside Funding, Knowledge, Interest and Expertise.
  Remove typed lots and evidence ledgers rather than retaining hidden subtypes.
- Store purchase counts, permanent appointments, independent timer progress, fractional reward banks and
  journal discoveries. Derive frontier, capacity, modifiers and rates.
- The highest purchased target defines a permanent frontier yield. Production is
  capacity × frontier × equipment/practice bonus. Target research is a Knowledge
  purchase in Analysis; no target selection or reassignment command.
- The initial observing routine automates the free telescope. Extra telescopes
  and the reflector add capacity; equipment and practice boost output. Older
  infrastructure continues contributing.
- Instant analysis spends generic Data once for Knowledge. A single repeatable
  archive-research producer spends Data once for passive Knowledge. No continuous
  Data consumption, queue assignment or duplicate study family per target.
- Knowledge unlocks scientific capabilities. Expertise buys efficiency/practice.
  Research institute access requires the first graduate, not a particular role.
- Passive producers never require recurring wallet inputs. Classrooms and research teams pay construction costs upfront.
  Appointments use one unassigned graduate and cannot reverse established work
  within the run; all ordinary progress resets at prestige.
- Scale active yields with their relevant station bonuses; observing also scales
  with frontier yield. Analysis methods/workstations improve instant conversion
  as well as passive Knowledge.
- Next-unlock guidance uses actual gates; optional advice stays separate.
- Show actual marginal output, active-yield and conversion gains before purchase.
  Quote previews must not temporarily mutate the live state.

Commands remain `buyInvestment`, `performStationAction`, `processData` (quantity
only), `beginPrestige`, `buyInsightUpgrade`, and
`startNextRun`. Commands execute before production at their boundary.
Held actions share the fixed cooldown and tick cadence; ordinary purchases are not
limited by the action cooldown. Each timed producer repeats automatically; only whole rewards enter available totals.

## 4. Current opening content

| Stage | Unlock / investment | Behavior |
|---|---|---|
| Starter | Moon ×1, free telescope | Click/hold Observe; 5 Data establishes passive routine |
| Analysis | Routine, then 10 Data | Immediate Knowledge or repeatable archive income |
| Outreach/support | Knowledge opens outreach; K/I opens support | Interest buys permanent supporters; Funding buys equipment |
| Jupiter | Analysis, 8 K | Frontier ×2 boosts existing capacity and active observing |
| Capacity | Extra telescopes, mount and tracking | More capacity plus operating bonus; no replacing old gear |
| Engineering | Tracking, 30 F + 15 K | Founding workshop supplies 0.15 E/s before Academy |
| Saturn | Tracking and Jupiter, 20 K | Frontier ×3 |
| Enclosure | Workshop + reflector, 10 E + 60 F + 15 K | First facility adds 4 base observing capacity |
| Imaging | Reflector/camera; Saturn, then 35 K | Star-cluster frontier ×5 reveals Academy |
| Academy | 80 F + 15 K + 4 I | Automatic founding classroom and permanent station appointments |
| Research | First graduate, 30 F + 10 K | Mentoring generates X for efficiency and teaching qualification |
| Robotic dome | Enclosure + Research, 40 E + 160 F + 40 K | Adds 8 capacity and enables spectrograph development |
| Nebula research | Star clusters, 80 K | Frontier ×8; enables expanded facility and prestige eligibility |

These are numerical seeds, not pacing promises. Do not introduce every planned
planet, galaxy, telescope size or spacecraft before reviewing this small loop.
A target multiplier represents useful network output, not exact per-instrument
physical sensitivity or observation provenance.

## 5. Recruitment and science timers

Use the parallel production contract above. Classroom cycles remain 40 seconds;
science cycles remain 60 seconds regardless of staffing, practice or Insight.
Each additional team owns its own phase; never reset or accelerate another timer.
Compute cycle rewards from current practice/Insight at completion and bank fractions
per station. Effective rates are averages; rewards arrive only on timer completion.
The first classroom and first science team are included in their unlocks. No
specific appointment is mandatory. Add teams with permanent, escalating purchases.
There are no academy or science active-assistance commands.

## 6. Interface and saves

Stable station sections contain local balance, rate, assistance, owned producer
counts and purchase buttons. Observatory shows frontier × capacity × bonus and
retained telescope counts. Analysis shows one Data balance, immediate Knowledge
buttons and the separate permanent-income purchase. Knowledge and Expertise labels
explain scientific understanding versus institutional practice.

No gameplay dropdowns, percentages, numeric forms, evidence inventories, funding
priorities or staff reassignment. Keep pause/speed/advance/save utilities separate.
Stop held inputs on release, cancellation, focus loss, pause and hidden tab.

Schema 13 and simulation 0.14.0-progression identify the economic progression revision.
The exact P12 save migrates with its entire state unchanged; updated prices and
reward factors apply to future purchases/production. No people, owned classrooms,
Insight levels, timer phases or completion progress are removed.
The exact P11 save migrates with empty joint state and all prior fields intact,
including mission phases, results, fractional rewards and Insight.
The exact P10 save migrates with empty mission state and every prior field intact.
The exact preceding parallel save migrates without changing its state, including
Insight, all timer phases and fractional banks.
Exact bundled P5–P7 saves migrate to independent classrooms/research teams. Retain
resources, purchases, people, discoveries, Publications, grants and all P7 Insight.
Founding timers inherit unfinished work, capped below one full cycle; additional
teams begin at zero. Migration never awards graduates or Publications. Earlier or
custom configurations retain the export/new-run fallback. Reload resumes paused;
no offline progress or restored held input.

## 7. Verification and remaining packages

Adapt the existing single station progression scenario/test. Check one Data wallet,
capacity/frontier compounding, instant processing with continued observing, scaled
assistance/analysis, alternative first staffing, independent parallel timers, fractional
cycle rewards and normal save round-trip. Use type checks and a browser walkthrough. Add no broad
correctness suite or failure-case matrix.

| Package | Remaining scope / gate |
|---|---|
| R3 player review | Judge clarity, target payoff, purchase choices and recruitment pacing; adjust the small loop |
| P6 Programs/grants — implemented | Photometry, automatic studies, Publications, grant office and Publication-backed grant income; scientist and scientific-practice improvements |
| P7 Prestige — implemented | Full reset of all ordinary progress; earn Insight and spend it at prestige on persistent global modifiers; rebuild the entire network faster |
| P8–P9 Measurement/tuning — reviewed | Multiple prestiges and parallel timers accepted by player; retain fast testing pace and defer general slowdown |
| P10 Network/engineering — implemented | Engineering Progress, benches/engineers/practice, enclosure → dome → expanded network → mountain telescope, optional spectroscopy, galaxy/galaxy-cluster frontiers |
| P11 Radio/space — implemented | Radio dishes/timing, radio frontier, staged optical orbit and distinct cooled infrared mission; each mission repeats science every 60 seconds |
| P12 Joint science/ending — implemented | Three complementary programs, Collaboration Credit upgrades, fixed 90-second synthesis and a completion panel; continued play and prestige remain available |
| P13 Final review | Human play and focused measurements before art/engine commitment |

P6 uses generic Data and capability requirements. Extra
scientific evidence accounting must earn its complexity through a useful decision;
it is not inherited automatically from the retired typed-inventory prototype.

Prestige contract: all ordinary progress resets, including infrastructure, station/target
unlocks, journal discoveries, people, appointments, Publications, grants and unfinished
work. Only Insight upgrades and unspent Insight persist. This supersedes older
retained-network requirements; the preview, full reset and Insight shop are now implemented.

## 8. Scientific production and grants

Developing photometry buys the founding repeating research team with generic Data,
Knowledge and Funding. Each extra team is a separate permanent capacity purchase.
The study definition supplies a 60-second cycle and one base Publication. Practice
and Insight multiply completed-cycle rewards; they cannot make studies instant.
Academy and science timers advance concurrently with all other stations.

The first Publication opens the grant office. Publications remain non-spendable;
each permits one grant, with quota checked atomically on purchase. Grants have no
upkeep. Automatic cycles provide additional grant capacity. The existing single
scenario/test covers repeated completion, continued observing, parallel phases,
fixed durations under bonuses, no wallet debit, fractional carry and save round-trip.

## 9. P7 implementation contract

`previewPrestige` is read-only. Eligibility requires `target-nebulae` and
`observing-grant`; payout is `4 + floor(sqrt(max(0, Publications - 1)))` when
eligible. Preview lists resource balances, purchased levels/producers, opened
stations, telescopes, trained people, discoveries, Publications, grants and
classroom/team counts, unfinished timer progress and fractional reward banks. The free Moon/telescope starting state
is explained separately from the erased purchases.

`beginPrestige` rechecks eligibility and atomically awards Insight, creates a fresh
ordinary state, increments the run number and sets phase `shop`. All stock balances,
purchases, staff, qualifications, discoveries, Publications, grants, timers, fractional rewards,
clock and action cooldown return to their initial state. Only Insight points,
upgrades and point-accounting/run metadata survive. Modified-run status remains
marked if it was marked before reset.

`buyInsightUpgrade` only succeeds in the shop, spends whole Insight and increments
the permanent level. `startNextRun` enters play without a second award/reset.
Ordinary commands are blocked and ticks do not advance in the shop. Shop saves
round-trip as ordinary canonical saves; reload never re-awards Insight. Validation
checks owned upgrade bounds and that available plus spent points equal earned points.

Permanent factors multiply local run modifiers in the shared rates calculation,
covering passive production, active help, instant analysis and timed cycle rewards;
timed durations remain fixed. The current five
upgrade families and prices are prototype definitions, not final balance.

The existing single progression test uses the same ordinary-command policy for
both runs, checks in-flight timer preview/reset, shop save/reload and faster recovery.
Before the progression revision, reference purchases yielded a 453.25-second rebuild versus 718.25 seconds
initially after the timer correction. Browser verification covers cancel/review, reset, shop reload, spending,
unspent carryover, new-run assistance, save restoration and narrow screens.


## 10. P10 engineering and facilities contract

Player review accepted multiple prestiges and parallel academy/science production.
P8–P9 review is complete enough to proceed; keep fast prototype pacing.

Tracking reveals Engineering. Open it with 30 F + 15 K; the founding bench
produces 0.15 Engineering Progress (E)/s, before Academy or Research exists.
Extra benches cost 60 F + 20 K initially (×1.5) for +0.25 E/s. Permanent engineers
cost one graduate plus 40 F initially (stock cost ×1.5) for +0.5 E/s. Click/hold
instrument development adds 0.25 base E/action; all other production continues.
Expertise-funded engineering practice adds +50% of base output per level. Existing
Connected thinking applies to E; other Insight modifiers keep their current scope.

Build sequential permanent facilities: enclosure after the reflector
(10 E + 60 F + 15 K, +4 capacity), robotic dome after Research
(40 E + 160 F + 40 K, +8 capacity), expansion after nebulae and a Publication
(160 E + 640 F + 160 K, +16 capacity), mountain telescope after galaxy research
(240 E + 1600 F + 320 K, +32 capacity). Older instruments remain productive.
Show the current facility, accumulated instruments and a small evolving diagram.

A robotic dome permits the spectrograph (20 E + 40 K), followed by optional stellar
spectroscopy (40 K) for +100% of base Publication rewards on existing 60-second
cycles. Science now measures brightness and spectra; no typed Data, extra wallet,
work allocation or instant science action is introduced. Expanded facilities and
nebula research unlock galaxy imaging (150 K, ×13 Data); a mountain telescope
unlocks galaxy-cluster imaging (300 K, ×21 Data). These are network productivity
multipliers and do not claim every earlier telescope can observe every object.

First-prestige eligibility and payout stay unchanged. All E, Engineering purchases,
facilities, instruments, new discoveries and spectroscopy reset at prestige.
P10 originally used schema 10 / 0.11.0-engineering to migrate the parallel save without
changing its ordinary state, timers, fractional rewards or Insight. Keep earlier
bundled migration support. Extend the single integration test through P10, checking
capacity/frontier growth, fixed science durations, save round-trip and full reset.

Historical pre-revision measurement: the Engineering scenario continued the second-run checkpoint,
reaching the mountain/galaxy-cluster frontier in another 130.75 simulated seconds.
Capacity rises 9 → 69, instruments 3 → 7 and Data 360 → 7245/s under its chosen
Insight/practice bonuses. These are prototype observations, not final balance.
The existing single integration test now continues through P10 and a further full
reset. Browser verification checks migration, Engineering purchases/assistance,
facility/target progression, fixed science timers and the narrow-screen layout.


## 11. P11 radio and space contract

Continue the mountain network with a distinct Radio station. Its first dish adds
24 base Data capacity; repeatable dishes add 12, paid once with escalating E/F/K.
Radio timing research increases cycle Publication rewards and radio-source research
raises the shared observing frontier to ×34. No radio-specific Data wallet.

Space missions reveal after the radio frontier. Buy a program office, platform,
optical payload and commissioning as separate one-way stages. Only commissioning
adds the first orbital telescope (+48 base capacity) and starts its independent
60-second Publication cycle (one base Publication). The first mission enables
transit-target research (×55 frontier) and optional orbital-monitoring improvements.
The infrared flagship requires the transit frontier and a completed orbital cycle;
therefore first orbit has productive play before the flagship can start.

The distinct flagship has a mirror, thermal shield and commissioning sequence.
Commissioning adds +96 capacity and a separate fixed 60-second cycle (two base
Publications). Infrared fields raise the frontier to ×89; one completed infrared
cycle permits deep-field research (×144). Labels describe measurement opportunities,
not life detection or a direct image of the Big Bang. Scientific productivity
multipliers remain abstractions. Optical, radio and both space instruments all remain.

All construction costs are one-time E/F/K purchases. No recurring spending, launches
that can fail, staffing allocations, mission restart actions, new currencies or
prestige exceptions. Practice/Insight multiply cycle rewards, never shorten timers.
Store mission progress, completed-cycle counts and fractional rewards; show active
missions, remaining time, results and assembly status. Commissioning starts progress
at zero and never awards a result immediately. Core ticks complete automatic cycles.

Schema 11 / 0.12.0-horizons adds empty mission state when migrating exact P10 saves,
preserving every prior state field and Insight. Older bundled migrations remain.
Extend the existing single progression test through both missions and full reset;
use one ordinary-command scenario and browser checks, not broad failure tests.

Historical pre-revision P11 seeds (superseded by the 2026-10-17 revision): radio observatory 80 E + 500 F + 200 K (+24 capacity),
extra dish 70 E + 450 F + 150 K (+12, prices ×1.6), radio timing 160 K + 3 X
(+50% base science rewards), radio frontier 250 K. Space program/platform/payload/
commissioning cost 60/90/120/60 E and 500/700/900/400 F, with K costs
200/250/300/150. Only commissioning adds orbital capacity (+48) and its timer.
Orbital monitoring costs 200 K + 5 X (+50% base science rewards); transit research
costs 400 K. Infrared program/mirror/shield/commissioning cost 100/180/150/100 E,
800/1400/1200/900 F and 300/450/400/300 K. Only commissioning adds +96 capacity
and the flagship timer. Infrared fields/deep fields cost 800/1200 K. Existing
production bonuses apply to all capacity; science bonuses apply to completed
mission rewards. No new statistic, Insight family or operating wallet is needed.

Historical pre-revision measurement: the scenario bought extra grants/benches/engineers and reached first
orbit at 686.5 simulated seconds in run two and the deep-field frontier at 883
seconds: 299 seconds beyond the P10 endpoint. Capacity grows 69 → 249, telescope
count 7 → 11 and Data 7245 → 179280/s with that policy's upgrades. The first orbital
result arrives before flagship construction; both 60-second mission timers stay
active afterward. These remain prototype timings, not final balance promises.


## 12. P12 joint science and ending contract

Joint Science reveals after the first orbital result. Open the center with
100 E + 600 F + 500 K. Establish three complementary programs as permanent
investments, each with an independent repeating 60-second cycle:

- Changing sky: optical photometry + radio timing, 50,000 D + 300 F + 600 K;
  one base Collaboration Credit and two base Publications per cycle.
- Planetary systems: orbital monitoring + stellar spectroscopy + transit frontier,
  100,000 D + 500 F + 900 K; two base Credits and three base Publications.
- Deep time: mountain/infrared/deep-field capability and first flagship result,
  250,000 D + 800 F + 1,200 K; three base Credits and four base Publications.

No typed evidence, input drains or repeating purchase/start actions. Science
bonuses multiply Publications; collaboration practice and Connected thinking
multiply Credits. Both rewards carry fractional balances per program. Timers never
shorten. Credit-funded upgrades improve observing, analysis, engineering and science;
Expertise-funded collaboration practice improves Credit rewards. These are ordinary
within-run investments and do not affect the Insight shop or prestige payout.

Once every program has completed at least one cycle, begin the final network
synthesis for 1,000,000 D + 1,500 F + 2,500 K + 200 E + 20 C. Its fixed 90-second
timer progresses while the network continues operating. No click assistance or
speed modifier. Record completion exactly once, show an ending that connects the
backyard to the multi-observatory network, and allow continued observing or prestige.
Completion is a finite prototype payoff, not a claim to solve astronomy or prove
life/multiverse hypotheses. Completion and all joint progress reset at prestige.

Schema 12 / 0.13.0-synthesis adds empty joint state when migrating exact P11 saves;
retain all previous wallets, timers, mission phases/results, modifiers and Insight.
Keep older bundled migrations. Extend the single integration test through Credit
production/spending, ongoing independent cycles, final timer/save restoration,
one-time completion and full reset; browser checks cover the ending and mobile UI.

The existing single progression test now reaches all three joint programs, spends
Credits on observing/analysis/engineering/science, resumes a synthesis after saving
at 30 seconds, checks the exact completion boundary and continued production, then
fully resets joint progress and the ending. No broad suite was added. The historical pre-revision
route started synthesis at 1133.75 seconds and completes at 1223.75 seconds in run two,
340.75 seconds beyond its P11 endpoint; it then runs another 60 seconds to check
continued production. All timings remain fast prototype seeds.


## 13. Progression revision verification and current measurements

`scenario:progression` completes the same purchase policy without resetting, then
compares the same route after one 5-Insight reset (observing, shared enthusiasm,
connected thinking). It appoints available graduates to fundraising before large
radio/space investments. It is a reproducible example, not an optimizer.

| First-run milestone | Simulated seconds |
|---|---:|
| Workshop | 331.5 |
| Enclosure | 431.5 |
| Academy | 556.5 |
| Robotic dome | 665 |
| Expanded observatory | 986.5 |
| Mountain telescope | 1186.25 |
| First orbital telescope | 2634.25 |
| Infrared flagship | 5065 |
| Ending | 5516 |

No-prestige ending: 5516 seconds. Rebuilt run ending: 3512.75 seconds; including
876.5 seconds before reset and 10 seconds of in-flight work, total 4399.25 seconds.
This shows a useful economic reset while proving first-run access. Classroom
stock costs are 30/90/270/810 F rather than 30/48/77/123 F. Education Insight
factors are explicitly differentiated from other global factors in the shop.
The existing single test verifies the first-run ending and ordered facility
milestones in addition to reset/reload/timer behavior. Browser review checks the
workshop before Academy, the increasing classroom prices and passive saving advice.
