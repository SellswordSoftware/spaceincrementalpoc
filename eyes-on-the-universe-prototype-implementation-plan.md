# Eyes on the Universe — Prototype Implementation Plan

Version 1.4 — 2026-10-16 — single Data and observing frontier

## 1. Authority and status

Implement [game design draft 0.7](eyes-on-the-universe-game-plan.md). The opening
station correction is implemented through academy/research, including the
[findings](findings.md): single Data, target frontier, consolidated Analysis,
scaled active help, real unlock guidance and revised academy pacing. P6 adds photometry, prepaid studies, Publications and grants.
Player review and any resulting tuning now include the implemented P7 full reset and Insight shop.

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
- Store purchase counts, permanent appointments, paid course progress and journal
  discoveries. Derive frontier, capacity, modifiers and rates.
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
- Passive producers never require recurring wallet inputs. Courses pay upfront.
  Appointments use one unassigned graduate and cannot reverse established work
  within the run; all ordinary progress resets at prestige.
- Scale active yields with their relevant station bonuses; observing also scales
  with frontier yield. Analysis methods/workstations improve instant conversion
  as well as passive Knowledge.
- Next-unlock guidance uses actual gates; optional advice stays separate.
- Show actual marginal output, active-yield and conversion gains before purchase.
  Quote previews must not temporarily mutate the live state.

Commands remain `buyInvestment`, `performStationAction`, `processData` (quantity
only), `enrollCourse`, `startProgram`, `beginPrestige`, `buyInsightUpgrade`, and
`startNextRun`. Commands execute before production at their boundary.
Held actions share the fixed cooldown and tick cadence; ordinary purchases are not
limited by the action cooldown. Completed paid courses award one graduate once.

## 4. Current opening content

| Stage | Unlock / investment | Behavior |
|---|---|---|
| Starter | Moon ×1, free telescope | Click/hold Observe; 5 Data establishes passive routine |
| Analysis | Routine, then 10 Data | Immediate Knowledge or repeatable archive income |
| Outreach/support | Knowledge opens outreach; K/I opens support | Interest buys permanent supporters; Funding buys equipment |
| Jupiter | Analysis, 8 K | Frontier ×2 boosts existing capacity and active observing |
| Capacity | Extra telescopes, mount and tracking | More capacity plus operating bonus; no replacing old gear |
| Saturn | Tracking and Jupiter, 20 K | Frontier ×3 |
| Imaging | Reflector/camera; Saturn, then 35 K | Star-cluster frontier ×5 reveals Academy |
| Academy | 80 F + 15 K | Prepaid courses and permanent station appointments |
| Research | First graduate, 30 F + 10 K | Mentoring generates X for efficiency and teaching qualification |
| Optional expansion | Star clusters, 80 K | Nebula frontier ×8 |

These are numerical seeds, not pacing promises. Do not introduce every planned
planet, galaxy, telescope size or spacecraft before reviewing this small loop.
A target multiplier represents useful network output, not exact per-instrument
physical sensitivity or observation provenance.

## 5. Recruitment and active-help balance

Current course: 8 F + 3 K + 4 I, paid upfront, 40 work. Base classroom rate 1/s;
teacher appointment adds 1/s. First passive F/I producers replenish the course's
cost in 20 seconds. The first teacher can therefore increase sustained throughput
from one course/40 s toward one course/20 s when Knowledge is sufficient.

Teaching help: 0.25 work/action, at most four actions per simulated second; methods
scale both active and passive teaching. Without bonuses, holding yields a 20-second
course, or roughly 13.3 seconds with one teacher. Do not make the permanent teacher
irrelevant by retaining the previous much stronger teaching action.

Show passive course duration versus the slowest enrollment-cost replenishment time.
Explain when another producer, rather than another teacher, is likely to help.
This is a steady-income estimate; existing savings and active assistance also matter.

## 6. Interface and saves

Stable station sections contain local balance, rate, assistance, owned producer
counts and purchase buttons. Observatory shows frontier × capacity × bonus and
retained telescope counts. Analysis shows one Data balance, immediate Knowledge
buttons and the separate permanent-income purchase. Knowledge and Expertise labels
explain scientific understanding versus institutional practice.

No gameplay dropdowns, percentages, numeric forms, evidence inventories, funding
priorities or staff reassignment. Keep pause/speed/advance/save utilities separate.
Stop held inputs on release, cancellation, focus loss, pause and hidden tab.

Schema 8 and simulation 0.9.0-insight identify P7. Exact bundled P6 and preceding
single-Data saves upgrade with zero Insight, preserving ordinary progress and
paid work. Single-Data saves also receive empty science state. Older/different configurations stay
untouched until an explicit new run/import, with export and local backup available.
Do not silently convert typed evidence or staffing choices into new commitments.
Reject mismatched configurations before replacing the active save. Reload resumes
paused; no offline progress or restored held input.

## 7. Verification and remaining packages

Adapt the existing single station progression scenario/test. Check one Data wallet,
capacity/frontier compounding, instant processing with continued observing, scaled
assistance/analysis, alternative first staffing, useful teacher acceleration and
normal save round-trip. Use type checks and a browser walkthrough. Add no broad
correctness suite or failure-case matrix.

| Package | Remaining scope / gate |
|---|---|
| R3 player review | Judge clarity, target payoff, purchase choices and recruitment pacing; adjust the small loop |
| P6 Programs/grants — implemented | Photometry, prepaid studies, Publications, grant office and Publication-backed grant income; scientist and scientific-practice improvements |
| P7 Prestige — implemented | Full reset of all ordinary progress; earn Insight and spend it at prestige on persistent global modifiers; rebuild the entire network faster |
| P8–P9 Measurement/tuning | Small reports only where needed to support concrete balance decisions |
| P10 Network/engineering | Larger facilities, new observing capabilities, instrument development and spectroscopy |
| P11 Radio/space | Distinct radio work, first orbit, separate IR flagship; meaningful play at each stage |
| P12 Joint science/ending | Complementary programs, collaboration improvements and finite network payoff |
| P13 Final review | Human play and focused measurements before art/engine commitment |

P6 uses generic Data and capability requirements. Extra
scientific evidence accounting must earn its complexity through a useful decision;
it is not inherited automatically from the retired typed-inventory prototype.

Prestige contract: all ordinary progress resets, including infrastructure, station/target
unlocks, journal discoveries, people, appointments, Publications, grants and unfinished
work. Only Insight upgrades and unspent Insight persist. This supersedes older
retained-network requirements; the preview, full reset and Insight shop are now implemented.

## 8. P6 implementation contract

Definitions declare a repeatable variable-star photometry study. `startProgram`
validates capabilities and spends 500 D + 20 K + 15 F once, before work begins.
One active study accumulates 60 work and awards one Publication on completion,
then clears itself. It has no recurring cost, evidence subtype or staff prerequisite.
The base photometry workspace supplies 1 work/s; the scientist appointment adds
1 work/s. Scientific-practice bonuses affect both that rate and active assistance.
Programs and academy courses can advance concurrently.

The first Publication opens the grant office. Publications remain non-spendable;
each permits one grant, with quota checked atomically on purchase. Grant Funding
runs without upkeep. Completing repeated programs is the ordinary route to more
capacity. Guidance explains the first study, publication, office and grant; the
next endpoint leads to the now-implemented prestige review once the nebula and grant requirements are met.

One existing scenario/test now reaches two Publications and grants, checks study
speedup/continued observing, and round-trips the resulting save. Browser review
also covers mid-study reload and the previous single-Data save upgrade. No broad
failure-case suite is added. Numerical seeds and prestige payout remain provisional.

## 9. P7 implementation contract

`previewPrestige` is read-only. Eligibility requires `target-nebulae` and
`observing-grant`; payout is `4 + floor(sqrt(max(0, Publications - 1)))` when
eligible. Preview lists resource balances, purchased levels/producers, opened
stations, telescopes, trained people, discoveries, Publications, grants and
unfinished paid course/program progress. The free Moon/telescope starting state
is explained separately from the erased purchases.

`beginPrestige` rechecks eligibility and atomically awards Insight, creates a fresh
ordinary state, increments the run number and sets phase `shop`. All stock balances,
purchases, staff, qualifications, discoveries, Publications, grants, paid work,
clock and action cooldown return to their initial state. Only Insight points,
upgrades and point-accounting/run metadata survive. Modified-run status remains
marked if it was marked before reset.

`buyInsightUpgrade` only succeeds in the shop, spends whole Insight and increments
the permanent level. `startNextRun` enters play without a second award/reset.
Ordinary commands are blocked and ticks do not advance in the shop. Shop saves
round-trip as ordinary canonical saves; reload never re-awards Insight. Validation
checks owned upgrade bounds and that available plus spent points equal earned points.

Permanent factors multiply local run modifiers in the shared rates calculation,
covering passive production, active help and instant analysis. The current five
upgrade families and prices are prototype definitions, not final balance.

The existing single progression test uses the same ordinary-command policy for
both runs, checks paid-work preview/reset, shop save/reload and faster recovery.
Its reference purchases yield a 380-second rebuilt P6 network versus 700 seconds
initially. Browser verification covers cancel/review, reset, shop reload, spending,
unspent carryover, new-run assistance, save restoration and narrow screens.
