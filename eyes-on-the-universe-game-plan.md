# Eyes on the Universe

Game design plan — draft 0.7 — 2026-10-16

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
Production is playable through academy, institutional research, photometry programs,
grants and full-reset Insight prestige. Later stages
remain planned, and numerical seeds remain subject to playtest.

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
| Nebulae | ×8 | Star clusters; optional opening expansion |

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
| Outreach | Spendable Interest | Standing activities/educators; supporters and academy enrollment |
| Support office | Funding | Supporter groups/fundraisers; hardware, facilities and courses |
| Academy | Unassigned people | Prepaid courses; permanent producers at destination stations |
| Research institute | Expertise | Mentoring/researchers; operating, teaching and scientific efficiency |
| Scientific programs | Publications | Prepaid brightness studies; Publication-backed grant capacity |

There is one repeatable archive-research investment. It spends Data once for
Knowledge income with no continuing drain. Instant analysis spends Data for
Knowledge immediately. Those are explicit short-term and long-term investments;
there are no typed processing queues or duplicate target-specific study families.
Discoveries enter a permanent journal through research purchases, not evidence
thresholds. Prepaid photometry studies now award Publications and unlock grant capacity.

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
improvements also improve instant Knowledge per Data. Teaching help is deliberately
modest enough that a permanent teacher still matters. Assistance ends on release,
cancellation, lost focus, pause or hidden tab. Opening a panel alone grants no bonus.

Next-unlock guidance follows actual dependency gates. Optional investment advice
is separate and must recognize alternative staffing/purchase choices. It must not
present a lunar study, observer appointment or teacher as a mandatory step when
other purchases can reach the same frontier.

## 5. Academy and permanent appointments

Courses pay their full F/K/I price up front and advance independently to one
integer graduate. No applicant wallet or founder-task management. One explicit
Enroll button starts each course; automatic enrollment remains deferred.

Current seeds: 8 F + 3 K + 4 I for 40 teaching work. The classroom supplies 1 work/s;
a teacher adds another 1 work/s. Base active help is 0.25 work/action. Qualification
is purchased with K/X and permits any unassigned graduate to teach.

The first passive F/I producers replenish enrollment costs in 20 seconds, allowing
the first teacher's reduction from 40 to 20 seconds to improve sustained recruitment.
The Academy compares course duration with passive cost-replenishment time and
identifies the limiting resource. Savings/active help can cover temporary gaps.
More teachers may require more educators, supporters or fundraisers.

People are permanently appointed by destination-station buttons. Appointments
consume unassigned people, not total trained population. Observers add general
observing capacity, analysts K, educators I, fundraisers F, researchers X, and
teachers work/s. Existing producers never move or disappear. Keep recruitment
reachable so a permanent choice cannot consume a singular required worker.

## 6. Later progression and science boundaries

Preserve the visual spine: backyard setup → larger reflector → permanent enclosure
→ robotic dome → expanded observatory → mountain telescope → radio → first orbital
observatory → separate cryogenic infrared flagship. Paid construction stages and
older instruments remain. Larger facilities require mature supporting stations.
Radio adds a wavelength, not optical magnification. The first spacecraft has
meaningful observing work before the flagship becomes the frontier.

P6 implements capability-gated, fully prepaid programs using generic Data/Knowledge
and Funding. Photometry requires Research and a camera; no assigned scientist or
grant prerequisite. A variable-star study spends 500 D + 20 K + 15 F, runs for
60 work and publishes once. The base workspace supplies 1 work/s; permanent
scientists and Expertise-funded practice improve throughput. Repeated studies buy
a fresh sample rather than reusing an evidence ledger. Advanced evidence accounting
must earn its complexity through a concrete player decision.

Publications are non-spendable accomplishments. The grant office unlocks after the
first, costs 50 F + 10 K and permits one grant per Publication. The first grant
costs 20 F + 5 K and adds 2 F/s with no upkeep. Each new Publication opens one more
slot; grant prices rise on repeat purchases. Both Publications and grants reset
on prestige. Known-object journal entries are not novel research Publications.

Scientific target descriptions remain recognizable; fictional research cases are
labeled. Economic multipliers improve productivity, not arbitrary optical access.
Retain uncertainty in exoplanet and cosmological claims. No required life detection,
multiverse proof or direct image of the Big Bang. Planned ending: a connected
observatory program combining changing-star, exoplanet and early-universe studies.

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

A preview pauses the run and lists all losses, including paid work. Commitment
clears ordinary progress and enters a saved between-run shop. Buy global modifiers
with Insight, then begin the next run. No ordinary production occurs in the shop.
Upgrades/points are never awarded by preview or reload. Insight factors multiply
local equipment/practice bonuses and apply to active help as appropriate.

First modifiers: Data ×2, Knowledge ×2, Interest/Funding ×2, teaching/Expertise/study
work ×2, or all production ×1.25. First costs are respectively 2/2/2/2/1 Insight;
prices double per level. Unspent points can be saved for another prestige.

## 7. Next decision and scope

P7 is implemented. Review the opening network, first Publication/grant and the
full reset, Insight choices and rebuilding loop before adding more content. The single scenario also checks two paid studies, the
scientist speedup, Publication-backed grants, complete reset, shop continuation
and faster rebuilding with Insight. It does not establish fun or
final balance. Keep testing minimal as requested. No broad failure-mode matrix,
optimizer or generalized reporting project is needed.

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
