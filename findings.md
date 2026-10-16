# Station economy findings and progression revision

2026-10-16

## Purpose and status

This document is for the game designer and the next implementer. It explains the
current station economy, identifies its clarity and progression problems, and
records the user's proposed simplification before further content is built.

The single-Data revision is now implemented through academy and research.
Sections 1–4 preserve the proposal and the review of the preceding typed-Data
prototype; their “current” prices and behavior refer to that reviewed version.
Section 5 records the implemented resolution. The companion plans and README
describe the current running economy. All rates and prices remain prototype seeds.

Companion documents: [game design](eyes-on-the-universe-game-plan.md),
[implementation plan](eyes-on-the-universe-prototype-implementation-plan.md), and
[running prototype instructions](README.md).

## 1. Proposed direction: one Data currency and a clear observing frontier

The user proposes removing lunar, Jupiter and imaging Data as separate spendable
inventories. They add management without providing enough interesting choices.
All observations should contribute to one **Data** balance.

Research unlocks increasingly productive observation opportunities: the Moon,
Jupiter, other planets and moons, and progressively more demanding or distant
objects. These unlocks increase the Data the operation can produce. Targets
become a progression spine, rather than additional resource types to manage.

Telescopes and equipment provide the repeatable production investment. Their
accumulation and major upgrades drive the visible growth from backyard equipment
to larger telescopes, mountain observatories and eventually orbital telescopes.

### Responsibilities in the revised model

| Element | Responsibility |
|---|---|
| Data | One spendable output from all observing production |
| Target/capability unlocks | Research milestones that permanently increase productive potential |
| Telescopes | Producers that add observing capacity |
| Equipment and methods | Improvements that increase the yield of installed capacity |
| Facilities | Visible milestones that expand capacity or permit new instruments/capabilities |
| Knowledge | Understanding gained through analysis; purchases capabilities and unlocks |
| Other stations | Supply Funding, people and later improvements that feed observing growth |

A candidate economic relationship is:

**Data/s = installed observing capacity × unlocked target yield × production bonuses**

This is an explanatory model, not a settled formula. The target-yield rule needs
one explicit choice before implementation: either a permanent frontier multiplier
that rises with target unlocks, or permanent additive contributions from unlocked
targets. Both can preserve one wallet and simple clicks. The recommended starting
point is the frontier multiplier because it makes the next research unlock and
its benefit to existing capacity easy to understand.

A target unlock should be a purchase button with a permanent benefit. It should
not introduce a target dropdown, a reversible active-target choice, or a way to
reduce previous production. Telescopes and equipment remain useful after later
unlocks. Major new capabilities can require an appropriate equipment milestone.

Early target unlocks must be reachable through Knowledge and existing stations.
Do not require the late Research institute to unlock Jupiter if Jupiter is itself
required to reach that institute. In this context, “research unlocks targets” means
research purchases throughout progression, not necessarily the sixth station.

The production multiplier represents useful scientific output. A farther object
need not be described as providing more incoming light. Target names, discoveries
and visual changes can retain astronomy's identity without typed Data wallets.
Earlier instruments' contributions can be abstracted as part of the network;
the game should not claim that every small telescope can observe every frontier
object directly.

### Consequences for the current prototype

- Replace three Data balances and type-specific spending checks with one wallet.
- Replace separate lunar/Jupiter/imaging income investments with clear observing
  producers and research/capability upgrades.
- Reconsider the three archive-study purchase families. A common archive-research
  producer can scale with one Data price curve instead of duplicating the same
  function for each target.
- Keep the explicit action that spends Data for immediate Knowledge while observing
  continues. A permanent passive Knowledge investment can remain a separate choice.
- Preserve target discoveries in the journal without making each discovery another
  currency or evidence inventory.
- Rework Moon/Jupiter/image unlock gates around explicit research, equipment and
  discovery milestones. Do not merely rename typed counters while retaining the
  same hidden accounting burden.
- Keep station purchases, permanent appointments and independent production.
- Use target unlocks and instrument/facility construction as conspicuous progression
  events, with their Data-rate benefit visible before purchase.

Later scientific programs should first use capability requirements and explicit
Data/Knowledge purchases. Introduce additional evidence tracking only if it creates
a concrete, worthwhile player decision. Do not carry forward typed-evidence
complexity solely because it already exists in the prototype.

## 2. Current implemented system relationships

The first economic loop is:

**Observations → Knowledge → Interest → Funding → better observations**

The academy adds:

**Funding + Knowledge + Interest → people → permanent station producers**

Research adds:

**Research projects/researchers → Expertise → improvements to earlier production**

All purchased passive production operates independently. There are no percentage
allocations, wages, recurring operating costs, or reversible staff assignments.
Wallets decrease on purchases; acquired producers and appointments accumulate.

### Current currencies and progress records

| Resource | Source | Main uses |
|---|---|---|
| Typed Data | Moon/Jupiter/image actions and passive observing producers | Lunar recorders, opening analysis, immediate Knowledge, archive studies |
| Knowledge | Instant processing, archive studies, analysts | Stations, equipment, outreach, courses, research and improvements |
| Interest | Outreach actions, activities and educators | Support office, supporter groups and courses |
| Funding | Support actions, supporter groups and fundraisers | Equipment, academy, courses, research projects and outreach improvements |
| Unassigned people | Completed courses | Permanent station appointments |
| Expertise | Research actions, projects and researchers | Teaching qualification and observing/analysis/teaching improvements |
| Evidence | Processing or establishing an archive study with the appropriate Data | Current journal milestone thresholds; not a spendable wallet |
| Journal records | Reaching Moon/Jupiter/image evidence thresholds | Permanent accomplishments and unlock gates |

Total trained population never decreases. Appointments reduce only the number
still unassigned. Publications, Engineering Progress, Collaboration Credits and
Legacy are not playable systems yet.

### Current player flow

1. **Bootstrap observing.** Observe the Moon for 1 lunar Data per action. Holding
   supplies up to four actions per simulated second. Buy the first lunar recorder
   for 5 lunar Data; it adds 1 passive Data/s. Further recorders add capacity at
   increasing prices. Opening analysis costs 10 lunar Data after a recorder exists.

2. **Build Knowledge production.** Process 10 Data for 2 immediate Knowledge and
   10 evidence. The first lunar record requires 10 lunar evidence. Alternatively,
   an archive study spends Data once for lasting Knowledge income and credits its
   purchased Data as evidence once. First studies cost 25 lunar Data for 0.2 K/s,
   25 Jupiter Data for 0.3 K/s, or 100 imaging Data for 0.8 K/s. Their prices rise
   on repeat purchases. Passive study income does not create new evidence.

3. **Establish outreach and support.** The lunar record permits Outreach, costing
   5 Knowledge. Share the sky gives 0.5 Interest per action. The first outreach
   activity costs 2 Knowledge and adds 0.2 Interest/s. The Support office costs
   2 Knowledge + 5 Interest. Contact supporters gives 0.25 Funding per action;
   the first permanent supporter group costs 10 Interest and supplies 0.4 F/s.
   Spent Interest never removes an established supporter group.

4. **Expand observing.** Jupiter observations cost 10 Funding + 2 Knowledge and
   add 1 Jupiter Data/s. A stable mount costs 10 Funding + 3 Knowledge and adds
   25% of base passive Data output. Tracking requires the mount and Jupiter record
   (20 Jupiter evidence), costing 25 Funding + 5 Knowledge. The reflector costs
   60 Funding + 10 Knowledge and adds 2 lunar Data/s. Its camera costs 40 Funding
   + 8 Knowledge and adds 4 imaging Data/s. All channels continue independently.

5. **Improve analysis and reveal the academy.** The workstation costs 30 Funding
   + 5 Knowledge and adds 100% of base passive Knowledge. It consumes no Data or
   Funding while operating. Processing 100 imaging Data, or establishing the first
   imaging study, completes the image record and reveals the academy.

6. **Train permanent producers.** Open the academy for 80 Funding + 15 Knowledge.
   Enroll a course for 15 Funding + 5 Knowledge + 10 Interest, paid up front. A
   course requires 40 work; the classroom supplies 1 work/s. Teach adds 1 work per
   action. One course runs at a time and each completion produces one graduate.
   Further courses require another explicit enrollment purchase.

7. **Add institutional improvements.** The first graduate reveals Research; the
   graduate does not have to be appointed first. Opening Research costs 30 Funding
   + 10 Knowledge and includes 0.02 Expertise/s. Research actions add 0.01 Expertise
   each. Expertise buys teaching qualification and cross-station improvements.

### Current permanent appointments

Each appointment uses one unassigned graduate and cannot be reversed.

| Role | Base production added |
|---|---:|
| Observer | 2 lunar Data/s |
| Analyst | 0.5 Knowledge/s |
| Educator | 0.5 Interest/s |
| Fundraiser | 1 Funding/s |
| Qualified teacher | 1 teaching work/s |
| Researcher | 0.04 Expertise/s |

Teaching qualification costs 5 Knowledge + 0.5 Expertise. Existing unassigned
people can become teachers once it is purchased; they need not have graduated
after the qualification was unlocked.

The first observing-method improvement costs 5 Knowledge + 0.5 Expertise and
adds 25% of base passive Data. Analysis and teaching improvements initially cost
the same and add 50% of their respective base rates. Repeat prices increase.
Bonuses in the same category add together: mount +25% and observing methods +25%
give 150% of base production, not two successive multiplications.

## 3. Review findings and improvements

### A. Knowledge and Expertise overlap conceptually

Both currencies buy improvements, and “Develop methods” sounds similar to Analysis.
Their separate sources do not fully explain their separate purposes.

**Recommendation:** Knowledge should mean scientific understanding and unlock new
capabilities, including the proposed target progression. Expertise should mean
institutional practice and improve established operations. Rename actions and
purchases to reinforce that distinction. A later currency needs a distinct role,
not just a second price attached to otherwise similar upgrades.

### B. Immediate analysis and archive investment are not distinguished clearly enough

Both consume Data and produce evidence. One grants immediate Knowledge; the other
grants permanent income. The interface currently makes the player infer that
short-term versus long-term choice from prose.

**Recommendation:** Present the choices explicitly: “Analyze now: +2 Knowledge”
and “Expand archive research: +0.2 Knowledge/s permanently.” Use the single Data
wallet to remove the repeated target-specific versions of this choice.

The first lunar study costs Data worth 5 instant Knowledge and earns that amount
in 25 seconds; the Jupiter study reaches its equivalent in about 16.7 seconds.
The first imaging study also takes 25 seconds. Passive bonuses shorten these
periods, while repeated study prices increase them. Early studies are therefore
attractive unless Knowledge is needed immediately. Confirm that this is the
intended choice rather than accidental dominance.

### C. The objective strip presents optional investments as requirements

The guide requests a lunar study before proceeding, an observer before Research,
and a teacher before its final objective. These are not all actual unlock gates.
A player who appoints a fundraiser first can be making a sensible investment while
the guide continues asking for an observer.

**Recommendation:** Separate the actual **next unlock** from an optional **suggested
investment**. Recognize valid alternative purchases. The revised observing frontier
can supply a stable next milestone while station improvements remain choices.

### D. Teachers can finish courses faster without increasing sustained recruitment

One teacher reduces an unattended course from 40 seconds to 20. However, with one
basic outreach activity, replacing a course's 10 Interest takes 50 seconds. With
one basic supporter group, replacing its 15 Funding takes 37.5 seconds. In that
configuration, Interest income limits sustained enrollment before teaching does.
Stored balances can hide that limit temporarily.

Holding Teach gives approximately 4 extra work/s. A continuously assisted course
already takes about 8 seconds with the starter classroom; the first teacher lowers
that to about 6.7 seconds. Its benefit differs substantially between attended and
unattended play.

**Recommendation:** Explain whether recruitment is limited by enrollment resources
or course duration. Recommend educators/fundraisers when appropriate rather than
always guiding the player toward teachers. Revisit costs and assistance strength
if teaching investment should be a major early payoff.

### E. Manual actions do not grow with the station

Manual output is fixed while passive production increases. Share the sky supplies
approximately 2 I/s while held, ten times the first outreach activity's output,
but that same action becomes comparatively weak after expansion. Passive analysis
improvements also leave instant Knowledge per Data unchanged.

**Recommendation:** Let suitable station upgrades improve active assistance and
show the updated yield on the action. Target unlocks should visibly improve the
Observatory's active action as well as passive potential where appropriate. Keep
help additional and bounded; never stop other stations or restore allocation.
Exact scaling remains a balance decision.

### F. Some names and wallet displays imply different mechanics

A “lunar recorder” sounds like hardware but is purchased with observations.
“Observer” improves only lunar Data. “Interest” sounds like a popularity measure
but is spent like currency. The aggregate Data counter can show a large balance
while a purchase is blocked for lack of one particular type.

**Recommendation:** The single Data wallet removes the last issue and makes a
station-wide observing role more natural. Consider “recording practice” for the
initial Data-funded improvement, with actual equipment bought using Funding.
Consider “Community support” for spendable Interest. Keep names concrete and avoid
requiring scientific realism to explain every small economic exchange.

### G. Accumulated producers and actual purchase gains need greater visibility

Most growth is communicated through purchase descriptions and totals. The player
has to connect a base increment to bonuses elsewhere to work out its actual value.

**Recommendation:** Keep persistent counts/contributions for telescopes, equipment,
studies, outreach activities, supporter groups and staff. Show the next purchase's
actual income increase after bonuses, alongside its price. Use the telescope and
facility milestones as the main visual reward for accumulated capacity.

### H. Instrument provenance does not match the current equipment story

Current lunar Data is attributed to the founding telescope even when production
has increased through the reflector. This matters if later evidence/programs
require exact instrument identity or contribution histories.

**Recommendation:** With a generic Data economy, simplify the requirement first.
There is no reason to repair a detailed instrument-specific evidence ledger unless
a future mechanic genuinely needs it. Visible instrument ownership and network
contributions can remain separate from the spendable wallet. If exact scientific
attribution is introduced later, it must agree with the actual production model.

## 4. Recommended next revision

1. Settle the single-Data production relationship: repeatable telescope/equipment
   capacity plus permanent target/capability unlocks. Keep all investments additive
   or increasing; no target switching or allocation controls.
2. Adapt the opening Moon → Jupiter progression first. Verify that the research
   unlock, Data-rate increase, equipment purchase and Knowledge loop are legible
   before authoring many more targets.
3. Consolidate analysis spending around the common Data wallet. Make immediate
   Knowledge versus permanent Knowledge income an explicit choice.
4. Rewrite the objective strip around real unlock requirements, with optional
   investments clearly identified as suggestions.
5. Revisit active-action scaling and course resource requirements together, so
   assistance, teachers, educators and fundraisers each have understandable value.
6. Display actual production gains and accumulated observing infrastructure. Extend
   the same model toward larger ground facilities and orbital milestones after
   the small loop is clear.

This is a direction for the next prototype revision, not a requirement to add
all targets, facilities or space content immediately. Keep verification minimal:
use the playable opening and adapt the existing small progression scenario only
where necessary. No broad new correctness or failure-mode suite is needed.


## 5. Implemented resolution — 2026-10-16

The pre-P6 revision replaces typed observation inventories and evidence ledgers
with one Data stock. Research purchases permanently raise a network frontier:
Moon ×1 → Jupiter ×2 → Saturn and its moons ×3 → star clusters ×5 → nebulae ×8.
No target selection or reduction of existing production. The chosen formula is
installed observing capacity × frontier yield × equipment/practice bonus.

Repeatable additional telescopes and the reflector add capacity; equipment and
institutional practice improve output. Discoveries are explicit Knowledge purchases
recorded in the journal. Star-cluster imaging reveals the academy. Nebula imaging
is an optional opening expansion. Bigger facilities and spacecraft remain later
content; this revision does not implement every planned visual milestone.

| Finding | Implemented response |
|---|---|
| A. Knowledge/Expertise overlap | Knowledge buys scientific target/capability unlocks in Analysis. Expertise-only practice upgrades improve established operations. Research is described as institutional expertise and mentoring. |
| B. Analysis options unclear | One common archive-research producer; explicit Analyze-now buttons versus permanent Knowledge/s purchase. No typed study families or evidence thresholds. |
| C. Guidance forces optional purchases | Next unlock follows actual gates. Optional investment advice is separate. A first fundraiser, analyst or other eligible appointment does not block Research guidance. |
| D. Teachers may not improve sustained recruitment | Course price reduced to 8 F + 3 K + 4 I. Initial passive F/I rates replace these costs in 20 seconds; teaching takes 40 seconds, then 20 with a teacher. Academy compares supply and teaching limits. |
| E. Active help does not scale | Frontier/equipment/practice bonuses scale observing actions. Relevant upgrades scale outreach/support/teaching help and instant analysis yield. Teaching help is 0.25 base work/action, retaining useful teacher acceleration. |
| F. Names/wallets misleading | One Data wallet, a Data-funded observing routine, repeatable Funding-funded telescopes, and station-wide observing staff. Interest is described as community support for supporters/enrollment. |
| G. Purchased growth unclear | Owned telescope/staff counts, the capacity/frontier/bonus breakdown, and read-only actual marginal production/action/analysis gains on purchases. |
| H. Provenance mismatches equipment | Retired the detailed typed-lot/evidence ledger. The economy represents network output; journal discoveries preserve the scientific progression without false instrument-specific attribution. |

The existing single scenario/test was adapted, not expanded into a broad suite.
It exercises permanent discovery/capacity growth, scaled active yields and analysis,
a valid alternative first appointment, teacher acceleration and a normal save
round-trip. Its representative path reaches the academy at 438.25 simulated seconds
and the final checkpoint at 610 seconds. These are one policy's measurements,
not final balance or evidence of enjoyment.

Type checks and browser walkthroughs support the implementation. The next decision
is player review of the revised opening before P6 programs/grants. The earlier
observations about economic balance remain useful tuning questions; implementation
of clearer rules and feedback does not by itself establish satisfying pacing.


## Prestige decision — 2026-10-16

The user has chosen a full reset, superseding every retained-network prestige
proposal above or in older plans. On prestige, all ordinary currencies, producers,
telescopes, equipment, facilities, station/target unlocks, discoveries, people,
appointments, qualifications, operational upgrades, Publications, grants and
unfinished course/program progress reset. The player rebuilds the entire network.
No retained infrastructure or staff shortcut is part of the reset contract.

Prestige awards **Insight points**. At the prestige transition, the player spends
Insight on persistent global modifiers that accelerate the next run. Insight
upgrades and any unspent Insight are the permanent progression layer. Ordinary
production still only accumulates within each run. Eligibility, payout values
and the Insight shop are P7 implementation work; do not add a reset without its
preview and upgrade spending flow. The former currency name Legacy is superseded.

The next authorized implementation is P6: prepaid scientific programs,
Publications and grants on the single-Data economy. Full-reset prestige follows
as P7, rather than being silently implemented as part of P6.


## P6 implementation record — 2026-10-16

The user accepted the single-Data network as the opening base, selected the full
reset/Insight contract above, and authorized P6. P6 now adds photometry, prepaid
variable-star studies, Publications, a grant office and Publication-backed grants.
The first study needs no grant or assigned scientist. Scientific staff and practice
accelerate later studies, and each paid fresh sample awards its Publication once.
All systems remain independent and use buttons, with no typed evidence inventory.

The ordinary-command scenario publishes first at 670 simulated seconds and reaches
two Publications/two grants at 700 seconds. A scientist halves passive study duration
from 60 to 30 seconds; grants raise base Funding from 2.2 to 6.2/s while observing
stays at 144 Data/s. These are one policy's measurements, not final balance.
The existing single test was extended and previous bundled single-Data saves
upgrade without losing progress. Full-reset prestige and its Insight shop remain
P7 work; no partially implemented reset is exposed in P6.


## P7 implementation record — 2026-10-16

Full-reset Insight prestige is now implemented. The nebula frontier plus a secured
grant make the run eligible. The preview pauses play, explains exact losses and
the reward, and permits exporting or keeping the run. Commitment clears the entire
ordinary network and enters a saved, paused Insight shop. Permanent modifiers and
unspent points carry forward; all ordinary systems must be rebuilt.

The first eligible run earns 4 Insight. Additional Publications add diminishing
rewards: 2 gives 5, 5 gives 6, 10 gives 7. Five permanent modifier families cover
observing, analysis, outreach/funding, teaching/research/science, and all production.
Their factors apply to passive output and appropriate active actions. Prices double
per level; the shop is available only between runs.

The same scenario policy rebuilds the complete P6 network in 380 simulated seconds
with observing/shared-enthusiasm/connected-thinking upgrades, versus 700 initially.
Academy recovery is 173.25 seconds versus 438.25. The single existing test extends
through previewed paid-work losses, full reset, shop save/reload and rebuilding.
This verifies one path and modifier choice, not final pacing or optimal play.

P6 and earlier single-Data saves migrate without losing ordinary progress. Prestige
is a deliberate in-game reset with a preview; loading an old save is not prestige.
The next work is player review and focused P8/P9 measurement/tuning before expanding
later facilities and observing content.
