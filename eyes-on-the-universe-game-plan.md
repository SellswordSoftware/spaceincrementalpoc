# Eyes on the Universe

Game design plan — draft 1.2 — 2026-10-16

## Progression revision — 2026-10-17

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

## 1. Current direction and authority

The playable prototype uses independent stations, one Data wallet, permanent
appointments and a research-unlocked observing frontier. This supersedes typed
lunar/Jupiter/imaging Data and evidence requirements in earlier drafts. The
[findings](findings.md) preserve that review and its resolution. Historical plans
remain in [design history](docs/design-history/game-plan-before-station-revision.md).

The central loop is **add observing capacity → research a better target → produce
more Data → strengthen other stations → improve observing again**. Purchases
accumulate production. No percentages, target switches, reversible staff allocation,
wages or recurring operating budgets. Attention supplies extra help to one station;
all installed production continues independently.

The player grows from a backyard telescope toward larger instruments, permanent
facilities, mountain observatories, radio and two distinct orbital missions.
Production is playable through academy, institutional research, photometry, grants,
Insight prestige, Engineering, radio, two space observatories, joint science and
a finite network synthesis ending. Numerical seeds remain subject to playtest.

## 2. Single Data economy and observing progression

**Data/s = installed observing capacity × frontier yield × equipment/practice bonus.**

The frontier is the highest researched target. Each discovery is an explicit,
permanent Knowledge purchase; it never replaces a productive assignment or reduces
output. Targets are milestones, not inventory types or selectable workloads.

| Implemented frontier | Permanent yield | Additional prerequisite |
|---|---:|---|
| Moon | ×1 | Starting capability |
| Jupiter | ×2 | Basic analysis |
| Saturn and its moons | ×3 | Jupiter and motorized tracking |
| Star clusters | ×5 | Saturn and imaging camera |
| Nebulae | ×8 | Star clusters; required for prestige |
| Galaxies | ×13 | Nebulae and expanded observatory |
| Galaxy clusters | ×21 | Galaxies and mountain telescope |
| Radio sources | ×34 | Galaxy clusters and first radio dish |
| Transit targets | ×55 | Radio sources and first commissioned orbital telescope |
| Infrared fields | ×89 | Transit targets and commissioned infrared flagship |
| Early-galaxy deep fields | ×144 | Infrared fields and first completed flagship science cycle |

The founding telescope is free. A Data-funded observing routine establishes its
passive capacity. Repeatable additional telescopes and the reflector add capacity;
mounts, camera equipment and institutional practice improve output. Every retained
producer benefits from future frontier upgrades. The interface shows capacity,
frontier, bonuses, actual Data/s and owned infrastructure separately.

The multiplier abstracts useful network scientific output. It does not imply more
incoming light from more distant objects or that a small telescope can perform
any measurement. Major capability unlocks still require suitable equipment.
No exact instrument-specific evidence ledger is required for the economy.

## 3. Station responsibilities and currencies

| Station | Output | Durable investments / next uses |
|---|---|---|
| Observatory | Data | Telescopes/equipment scale capacity; Data buys analysis and archive investments |
| Analysis lab | Knowledge | Instant analysis or passive archive income; scientific capabilities and targets |
| Outreach | Spendable Interest | Standing activities/educators; supporters and opening the academy |
| Support office | Funding | Supporter groups/fundraisers; hardware, classrooms and research teams |
| Academy | Unassigned people | Automatic classrooms; permanent producers at destination stations |
| Research institute | Expertise | Mentoring/researchers; operating, teaching and scientific efficiency |
| Scientific programs | Publications | Automatic brightness/spectral cycles; Publication-backed grant capacity |
| Engineering workshop | Engineering Progress | Benches/engineers; facilities and instruments |
| Radio observatory | Shared Data | Dishes; radio frontiers and timing science |
| Space missions | Shared Data and Publications | Staged construction; independent optical/infrared cycles |
| Joint science | Collaboration Credits and Publications | Complementary timed programs; network upgrades and final synthesis |

There is one repeatable archive-research investment. It spends Data once for
Knowledge income with no continuing drain. Instant analysis spends Data for
Knowledge immediately. Those are explicit short-term and long-term investments;
there are no typed processing queues or duplicate target-specific study families.
Discoveries enter a permanent journal through research purchases, not evidence
thresholds. Automatic photometry cycles award Publications and unlock grant capacity.

Knowledge represents scientific understanding and unlocks capability. Expertise
represents institutional practice and improves established output. Target research
begins in Analysis before the later Research institute exists, avoiding circular
progression. The institute opens after any first graduate; no specific appointment
is required. Expertise-only practice purchases reinforce the currency distinction.

## 4. Interaction and feedback

Each progressively revealed station groups its balance, passive income, active
action, producer counts and purchases. Controls are buttons. Costs, missing
requirements and actual marginal output after bonuses are visible before purchase.
Discoveries show their permanent frontier benefit. No gameplay selects or editable
counts. Art is deferred; station identity and accumulated infrastructure remain
legible through labels, counts and a small set of visuals later.

Hold repeats at four actions per simulated second; faster tapping gives no extra
benefit. Appropriate methods/equipment scale active and passive output. Analysis
improvements also improve instant Knowledge per Data. Academy and science use timed producers with no active assistance. Assistance ends on release,
cancellation, lost focus, pause or hidden tab. Opening a panel alone grants no bonus.

Next-unlock guidance follows actual dependency gates. Optional investment advice
is separate and must recognize alternative staffing/purchase choices. It must not
present a lunar study, observer appointment or teacher as a mandatory step when
other purchases can reach the same frontier.

## 5. Academy and permanent appointments

Opening the academy costs 80 F + 15 K + 4 I and includes the founding classroom.
It graduates automatically every 40 seconds. Teaching qualification uses K/X and
unlocks additional teaching teams; each adds an independent classroom, with the
initial 30 F + 10 K stock cost scaling ×3 and one graduate permanently appointed.
There is no enrollment/restart action or recurring tuition.

Practice and Insight multiply graduates per completed cycle. Fractions accumulate
across completions; only whole graduates enter the population. Timers never shrink.
Show independent phases, remaining time, effective reward and average output.

People are permanently appointed by destination-station buttons. Appointments
consume unassigned people, not total trained population. Observers add general
observing capacity, analysts K, educators I, fundraisers F, researchers X; teaching
and scientific teams add separate timed producers. Existing producers never move
or disappear. The founding classroom keeps recruitment reachable.

## 6. Later progression and science boundaries

Preserve the visual spine: backyard setup → larger reflector → permanent enclosure
→ robotic dome → expanded observatory → mountain telescope → radio → first orbital
observatory → separate cryogenic infrared flagship. Paid construction stages and
older instruments remain. Larger facilities require mature supporting stations.
Radio adds a wavelength, not optical magnification. The first spacecraft has
meaningful observing work before the flagship becomes the frontier.

Photometry requires Research and a camera. Its one-time 500 D + 30 K + 15 F
unlock establishes the first repeating research team, with no staff/grant prerequisite.
Each team publishes once per 60-second cycle. Additional teams initially cost one
graduate + 500 D + 20 K + 30 F, with stock costs scaling ×1.6. No recurring
sample purchases, automatic Funding drain or restart button is needed. Practice
and Insight multiply Publications per completion; fractions carry and timers stay
fixed. Advanced evidence accounting must earn its complexity through a decision.

Publications are non-spendable accomplishments. The grant office unlocks after the
first, costs 50 F + 10 K and permits one grant per Publication. The first grant
costs 20 F + 5 K and adds 2 F/s with no upkeep. Each new Publication opens one more
slot; grant prices rise on repeat purchases. Both Publications and grants reset
on prestige. Known-object journal entries are not novel research Publications.

Scientific target descriptions remain recognizable; fictional research cases are
labeled. Economic multipliers improve productivity, not arbitrary optical access.
Retain uncertainty in exoplanet and cosmological claims. No required life detection,
multiverse proof or direct image of the Big Bang. The implemented ending synthesizes a connected observatory program combining
changing-star, planetary-system and early-galaxy research.

Prestige is a full reset. All ordinary currencies, producers, telescopes,
equipment, facilities, unlocks/discoveries, people, appointments, qualifications,
Publications, grants and unfinished work must be rebuilt. This supersedes retained
infrastructure and staffing proposals in earlier drafts. Within-run investments
still never decrease through ordinary purchases.

Prestige awards **Insight points**, spent at the transition on persistent global
modifiers for future runs. Only Insight upgrades and unspent Insight persist.
P7 now implements the eligibility/payout preview, full reset and Insight shop together.
The former Legacy currency name is superseded. Current eligibility is the nebula
frontier plus a secured grant. Current reward is 4 Insight plus the whole square
root of additional Publications after the first. Values are provisional; the
full-reset boundary is settled by the user.

A preview pauses the run and lists all losses, including timed producers and fractional rewards. Commitment
clears ordinary progress and enters a saved between-run shop. Buy global modifiers
with Insight, then begin the next run. No ordinary production occurs in the shop.
Upgrades/points are never awarded by preview or reload. Insight factors multiply
local equipment/practice bonuses and apply to active help as appropriate.

First modifiers: Data ×2, Knowledge ×2, Interest/Funding ×2; Institutional memory
gives graduate rewards ×1.2 and Expertise/Publications ×2. Connected thinking gives
graduates ×1.05 and other production ×1.25. First costs are respectively 2/2/2/2/1 Insight;
prices double per level. Unspent points can be saved for another prestige.

## P10: engineering and ground observatories

Tracking reveals the Engineering workshop. It opens for 30 F + 15 K and
supplies 0.15 E/s, without requiring Academy, Research, grants or prestige. Further benches add 0.25 base
E/s, starting at 60 F + 20 K (×1.5 per purchase). Engineers permanently appoint one
graduate plus 40 F initially (Funding ×1.5) for +0.5 base E/s. Engineering practice
spends X for +50% of base E income and assistance. Connected thinking also boosts E.
Instrument-development clicking/holding supplies +0.25 base E/action.

Spend E, Funding and Knowledge once to add an enclosure, robotic dome, expanded
observatory and mountain telescope, successively adding 4/8/16/32 base observing
capacity. The enclosure follows the reflector; the dome follows Research; expansion
needs nebula research and a Publication; the mountain telescope follows galaxy research. Installed instruments keep contributing. The observatory diagram and
facility milestones show accumulated construction, current stage and telescope count.

The expanded observatory enables galaxy imaging (150 K, ×13 frontier); the mountain
telescope enables galaxy-cluster imaging (300 K, ×21). These keep the one-Data model.
The optional science branch develops a spectrograph after the robotic dome (20 E +
40 K), then stellar spectroscopy (40 K) adds +100% of base Publication rewards.
Existing independent 60-second cycles continue without phase changes or new input
costs. Spectral measurements complement brightness measurements. No typed evidence,
allocation controls, upkeep or instant study clicks return.

All E, benches, engineers, facilities, instruments, spectroscopy and discoveries
reset at prestige. The first-prestige eligibility/payout stays unchanged. P11 extends these facilities with radio and orbital hardware as described below.

## P11: radio and space observatories

The mountain/galaxy-cluster frontier reveals Radio. The first dish supplies 24 base
Data capacity; further dishes supply 12 at increasing one-time costs. Radio-source
research raises the frontier to ×34, and optional radio timing adds +50% of base
Publication rewards. Data remains shared; radio is a different observing band,
not an increase in optical magnification.

Space reveals after the radio frontier. Purchase the program office, platform,
optical payload and commissioning sequentially. Commissioning adds 48 base Data
capacity and starts a separate, automatic 60-second cycle producing one base
Publication. The telescope can immediately support transit-target research (×55).
Optional orbital monitoring improves cycle rewards. No evidence inventory or claim
of life detection is introduced.

The separate infrared flagship requires the transit frontier and at least one
completed orbital cycle, ensuring productive first-orbit play. Buy its program,
mirror/payload, thermal shield and commissioning. Commissioning adds 96 base Data
capacity and another independent 60-second cycle for two base Publications.
Infrared-field research raises the frontier to ×89; its first completed science
cycle opens early-galaxy deep fields (×144). These are capability/productivity
abstractions, not claims of directly imaging the Big Bang.

All earlier instruments and the first spacecraft remain productive. Mission timers,
completed-cycle counts and fractional rewards save/reload. Practice/Insight increase
rewards, keeping durations fixed; no commissioning reward, ongoing Funding/Data
cost, restart button or failure simulation. Prestige removes both missions, their
progress, all construction, radio dishes and discoveries. Only Insight persists.

## P12: joint science and the ending

The first orbital result reveals Joint Science. Its center costs 100 E + 600 F +
500 K and connects three complementary programs, each established once:

| Program | Contributions | Upfront cost | Base rewards per 60 seconds |
|---|---|---|---|
| The changing sky | Ground photometry + radio timing | 50,000 D + 300 F + 600 K | 1 Credit + 2 Publications |
| Worlds in context | Orbital monitoring + stellar spectroscopy | 100,000 D + 500 F + 900 K | 2 Credits + 3 Publications |
| Light across time | Mountain + infrared/deep-field capability | 250,000 D + 800 F + 1,200 K | 3 Credits + 4 Publications |

Every program repeats independently with no recurring spending. Science bonuses
multiply Publication rewards; collaboration practice and Connected thinking multiply
Credit rewards. Carry fractional rewards per program, and keep cycles at 60 seconds.
Credits buy permanent-within-run observing, analysis, Engineering and science
improvements, with increasing costs. Expertise improves collaboration practice.
No additional evidence inventory, reversible allocation or new Insight exception.

Once all three programs have returned at least one result, the final network
synthesis costs 1,000,000 D + 1,500 F + 2,500 K + 200 E + 20 Credits. Its fixed
90-second timer runs alongside the entire network. Completion is recorded once,
pauses the browser to show the ending and offers continued observing or prestige.
It connects the journey from a backyard telescope to complementary observatories;
it does not claim that all science is solved or that life has been detected.

The ending remains visible for this run and reloads safely. Continuing preserves
all producers; prestige removes Credits, joint programs, their fractional rewards,
the final project and completion record along with every other ordinary system.
Only Insight persists. P12 adds a finite prototype payoff without changing the
first prestige eligibility or reward formula.

## 7. Next decision and scope

P7, the revised timers and P10–P12 observatories/joint science/ending are implemented. Player review
found the basic network enjoyable; retain fast prototype pacing for now. Review the
revised first-run pacing, optional prestige decisions and staffing economy for P13 final review. The single
scenario checks independent repeating cycles, fixed durations with bonuses,
fractional reward carry, grants, full reset, shop continuation and faster rebuilding.
Keep testing minimal: no broad failure-mode matrix or generalized reporting project.

The first telescope and better-target unlock must feel consequential. A player
should know what each currency buys, distinguish a required discovery from an
optional investment, and see the contribution of established producers. Adjust
prices, labels and pacing when that is unclear before adding more systems.

## 8. Scientific references and review notes

Primary-source starting points, consulted 2026-10-15. These support scientific boundaries; they do not validate game balance, development effort, or commercial prospects.

1. [NASA — Telescope overview](https://science.nasa.gov/mission/webb/science-overview/science-explainers/telescope-overview/): Webb’s shielding, thermal environment, L2-region operation, and observing restrictions. Supports keeping the infrared mission distinct from ground observing.
2. [NASA — Webb’s impact on exoplanet research](https://science.nasa.gov/mission/webb/science-overview/science-explainers/webbs-impact-on-exoplanet-research/): Transmission spectroscopy and atmospheric characterization. Supports eligible-target atmospheric programs, not automatic life detection.
3. [NASA — Early universe](https://science.nasa.gov/mission/webb/early-universe/): Cosmological redshift stretches ancient light into infrared wavelengths. Supports the deep-field progression.
4. [NASA — Webb reaches new milestone in quest for distant galaxies](https://science.nasa.gov/blogs/webb/2022/12/09/nasas-webb-reaches-new-milestone-in-quest-for-distant-galaxies/): Follow-up spectra establish redshifts for selected distant-galaxy candidates. Supports separating candidate selection from spectroscopic evidence.
5. [ESO — Adaptive optics](https://www.eso.org/public/teles-instr/technology/adaptive_optics/): Atmospheric correction, reference stars, and artificial guide stars. Supports a limited specialized mode, not a universal image-quality multiplier.
6. [ESO — Interferometry](https://www.eso.org/public/teles-instr/technology/interferometry/): Baseline-dependent angular resolution and the distinction between an array and a filled collecting surface. Supports explicitly excluding arbitrary telescope pooling.
7. [AAVSO — Stellar photometry](https://aavso.org/stellar-photometry/): Scientific contributions from brightness measurements, including visual observing of suitable bright targets. Supports meaningful small-instrument roles.
8. [AAVSO — Stellar spectroscopy](https://aavso.org/stellar-spectroscopy/): Amateur spectroscopy, brightness/aperture constraints, and standard-star observations. Supports early bright-star spectroscopy and calibration requirements.
9. [AAVSO — Research opportunities](https://aavso.org/research-opportunities/): Amateur/professional research participation and photometric/spectroscopic archives. Supports the network premise.

Before production, obtain an astronomy review of target properties, instrument/task compatibility, quantitative approximations, exoplanet inference language, and cosmological labels. Maintain a source note alongside each authored science claim. Avoid anchoring the campaign to a rapidly changing “most distant known galaxy” record.
