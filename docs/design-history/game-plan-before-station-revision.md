> **Historical plan, superseded 2026-10-16.** See the current
> [game design](../../eyes-on-the-universe-game-plan.md) and
> [implementation plan](../../eyes-on-the-universe-prototype-implementation-plan.md).
> Economic, interaction, and work-package requirements below are not current.

# Eyes on the Universe

> **Current prototype interaction revision (user feedback, 2026-10-15):** Data is
> a typed spendable inventory. Observations keep their assignments and run
> independently. After the first ten lunar Data unlock basic tools, an explicit
> processing action instantly consumes Data for Knowledge and evidence without
> stopping observations. A workstation later enables continuous automatic
> processing. Telescope time is shared with outreach through explicit percentages;
> analysis uses no telescope time. Priority is an advanced funding order, not a
> speed control. Trained staff improve these independent systems; unstaffed
> startup production remains available. This supersedes the exclusive observe-or-analyze founder rule
> below; do not reintroduce that restriction when adding staff. Numeric pacing
> needs remeasurement for the revised loop.

## Game design plan — working draft 0.3

**Design status:** Concrete proposal for discussion and prototyping, not a locked specification. All costs, durations, counts, and balancing numbers below are design hypotheses.

## 1. The game in one paragraph

Start in a backyard with a cheap telescope and an incomplete sky journal. Learn to find objects, record observations, automate tracking, and equip increasingly capable instruments. Grow from a backyard installation into progressively larger dome observatories, add a ground-based radio facility, launch a first orbital observatory, and eventually deploy a cryogenic infrared flagship inspired by Webb. The growing telescope infrastructure is the central visual progression; supporting institutions have separate visual identities and resource/upgrade panels. Every earlier telescope remains visible and useful: teaching, monitoring, surveying, or triggering follow-up observations. Progress comes from building an increasingly capable scientific operation and repeatedly discovering that familiar points of light contain more information than you could previously extract.

**Player fantasy:** “I started by finding Saturn. Now my instruments work together to investigate worlds around other stars and the early universe.”

**Proposed format:** Single-player, finite incremental game; approximately 5–7 hours for a first completion, subject to prototype results. Designed around attentive play with short autonomous stretches. Prestige is a central acceleration mechanic, targeting three to five campaign resets; completion without resetting remains possible but much slower. A grounded ending, with optional speculative continuation later.

## 2. Design commitments

1. **New instruments enable new questions.** Aperture upgrades matter, but changing what can be measured supplies the major revelations.
2. **The network persists.** Buying a new telescope never deletes an old one or makes the player rebuild established automation.
3. **Scientific specialties preserve old equipment.** Wide fields, bright targets, cadence, and inexpensive continuous coverage remain useful beside faint-target sensitivity.
4. **Independent systems compound together.** Outreach recruits students; teaching supplies staff; staff operate telescopes and analysis; publications unlock grants; engineering unlocks instruments; joint science improves the whole network.
5. **The universe remains scientifically recognizable.** Known objects teach real astronomy. Fictional research targets have plausible properties and explicit fictional status.
6. **A small visual vocabulary supports the whole game.** One evolving network view, one observation workspace, and reusable scientific plots.
7. **The ending is achievable.** There is no requirement to solve all astronomy, discover life, or wait through real orbital periods.

## 3. Alignment with the Tower Wizard design framework

This uses the previously discussed framework as a design lens, rather than treating any individual mechanic as mandatory.

| Ingredient | Concrete implementation | Player payoff |
|---|---|---|
| Manual work becomes automatic | Find and record a target; later tracking, capture, processing, and repeat schedules automate | “My whole first session now happens by itself.” |
| Compounding production | Better detectors improve evidence yield; processing prevents queues; catalogs improve targeting; confirmed results support investment | Multiple investments reinforce one another |
| Interconnected systems | Survey → candidate → follow-up → result → new capability → richer survey | New systems give old systems new uses |
| Progressive revelation | Tracking, imaging, photometry, spectroscopy, coordinated surveys, infrared space observing | New ways to interact with familiar objects |
| Moving bottlenecks | Tracking → sensitivity → processing → cadence → follow-up capacity → wavelength access | Each phase rewards a different solution |
| Prestige and acceleration | Conclude campaigns, spend Legacy, rapidly rebuild operations; retain telescopes and established automation | Surpass the previous frontier much faster |
| Visible progression | Backyard instruments accumulate into an operating network, mountain dome, and space mission | Infrastructure becomes a record of the journey |
| Definite finish | Complete a coordinated science program requiring old and new instruments | A payoff for building the whole network |

**Critical rule:** An act cannot qualify as a major unlock solely because its numbers are larger. It must change a task, relationship, or available measurement.

## 4. What the player actually does

### The repeating loop

1. Choose a scientific objective from a small set of visible programs.
2. Assign an appropriate instrument or accept an explainable recommendation.
3. Acquire observations manually early, automatically later.
4. Process observations into usable evidence.
5. Combine the required evidence to complete a result.
6. Invest Knowledge, Funding, Expertise, and later specialist resources in interconnected production systems.
7. Redeploy existing instruments to support the new question; conclude a campaign when Legacy reinvestment offers a stronger route forward.

Early attention centers on an individual telescope. Later attention moves to the observing network and its priorities. The controls simplify as the operation grows.

### Meaningful choices

- Improve tracking on the current telescope or purchase a second instrument for coverage?
- Increase exposure depth or survey more sky to find candidates?
- Upgrade processing before another camera creates a backlog?
- Dedicate the medium telescope to transit monitoring or transient follow-up?
- Improve a spectrograph or construct the facility required for a new observing band?

Choices should normally be recoverable through reassignment. Avoid irreversible specialist builds during a short first campaign.

## 5. Economy: interconnected production systems

### Resource contract

Use **Knowledge** as the spendable product of analysis. Do not also introduce a generic Research wallet: research is an activity performed by programs and people. Spending Knowledge represents applying research-development effort; permanent discovered facts remain in the journal.

| Resource | Behavior and source | Main sinks or uses | Prestige behavior |
|---|---|---|---|
| Funding (F) | Spendable stock; donations, funded monitoring, grants, milestone awards | Equipment, operating budgets, academy, engineering | Unspent balance resets |
| Observation Data (D) | Consumable typed inventory from supported observations | Analysis jobs | Queue resets |
| Knowledge (K) | Spendable stock produced by processing useful data | Methods, courses, operational upgrades, scientific programs, engineering | Unspent balance resets |
| Public Interest (I) | Audience stock accumulated by outreach; soft-capped by outreach capacity | Non-consuming allocation between donations and recruitment | Audience resets; outreach infrastructure remains |
| Trained people (N) | Population supplied by academy; assignable, never consumed as currency | Operators, analysts, teachers, researchers, engineers | People and qualifications remain; assignments pause until funded |
| Expertise (X) | Spendable team-development points earned from useful staffed work | Team-specialization upgrades | Balance and campaign specializations reset |
| Publications (P) | Non-spendable campaign achievement count, earned from completed science programs | Grant eligibility, active grant ceiling, campaign score | Campaign count resets; archive and lifetime milestones remain |
| Engineering Progress (E) | Spendable development stock from engineering projects | Instrument modules, facility projects, space mission stages | Unspent balance resets; installed hardware remains |
| Collaboration Credits (C) | Late-game spendable stock from completed joint science programs | Large campaign-wide network improvements | Unspent balance and campaign improvements reset |
| Legacy (L) | Prestige currency granted when concluding an eligible campaign | Permanent upgrade tree | Retained, including unspent balance |

Evidence is persistent progress within an active investigation, not a freely exchangeable currency. Mission Readiness is a staged project checklist, not another wallet. Campaign Scientific Output (S) is a non-spendable prestige score. Processing and telescope time are capacities.

Do not display every resource at the start. Reveal its counter with its first productive system. Resource totals, net rates, caps, and paused consumers must be inspectable.

### Production nodes

| Node | Inputs | Outputs | Own scaling investments | Feedback to previous systems |
|---|---|---|---|---|
| Outreach program | Telescope time; optional Funding and staff | Public Interest | Event capacity, educational materials, planetarium partnerships | Audience increases donations and recruits |
| Donations desk | Audience allocated to donations | Funding | Supporter conversion, fundraising capacity | Funds observing and outreach |
| Observing programs | Funded allocation, telescope time, optional operators | Typed Data | Tracking, detectors, scheduling, coverage | Supplies analysis and scientific evidence |
| Analysis center | Data, funded processing; optional analysts | Knowledge plus linked target evidence | Compute, pipelines, analyst efficiency | Improves methods, courses, and future data quality |
| Academy | Funding, Knowledge investment, recruitment audience; later teachers | Trained people | Cohort capacity, curriculum, scholarships | Automates observing/analysis and expands teaching |
| Research teams | Assigned people, productive tasks, funded work | Expertise alongside normal task outputs | Mentoring, specializations, shared practice | Multiplies teaching, analysis, operations, and engineering |
| Scientific programs | Eligible evidence, Knowledge, researcher time, budget | Publications and milestone payments | Program slots, research efficiency, collaboration | Opens grants and larger equipment projects |
| Grant office | Publication eligibility and dedicated administrative budget | Recurring Funding | Grant slots, proposal efficiency, institutional partnerships | Pays for every other branch |
| Engineering lab | Funding, Knowledge, assigned engineers | Engineering Progress | Benches, project efficiency, instrument development | Creates new observing capabilities and automation |
| Joint science center | Complementary eligible evidence, researchers, program budget | Collaboration Credits, publications | Coordination, shared analysis, program capacity | Powerful boosts to established branches |

The same processed observation can yield Knowledge and target-linked evidence once. That is an explicit joint output, not two competing purchases of the same data. Raw data is consumed once. Program completion reserves/marks its evidence so a single packet cannot claim unlimited independent publication rewards.

### Staffing and operating budgets

The founder supplies one free starter work slot and can observe or analyze. Instrument tracking handles holding a target; staff and software later handle task selection, acquisition, reduction, and interpretation. No repeated click requirement survives as an optimal strategy.

Staff are assigned in anonymous pools. Generalists can operate or analyze immediately. Qualification upgrades later enable teaching, advanced research, and engineering. No individual personalities, salaries, aging, or attrition simulation.

Operating costs apply only to active allocated work, not an unavoidable institutional wage drain. Funding shortage proportionally throttles a priority-ordered set of jobs and never creates debt or deletes people. Startup self-analysis and basic outreach retain a free mode. Published grants cannot require a larger mandatory recurring cost than their own income. The UI reports gross and net Funding rates.

Recruitment uses audience allocation without consuming the audience stock. Donations and recruitment compete for its attention. Academy capacity and training throughput bound population growth. The first short course is founder-taught; teaching qualification has no teacher prerequisite. New teachers can accelerate later cohorts, but cannot create unbounded instantaneous growth.

### Bootstrap and recurring production

Begin with a free telescope, seed Funding, and a free observing/analysis action. The first lunar record provides seed Knowledge. The first outreach investment supplies sustainable donations before funded operations become necessary. Every required system has a productive route using already-unlocked resources.

Early journal entries are observations of established objects, not novel publications. Public outreach generates early income. A small monitoring contract becomes available before the grant office. The first publishable program uses the already-available photometry tools and a founder/generalist researcher; later qualification upgrades improve it.

Repeat monitoring, new samples, and extended campaigns provide sustainable baseline output. First-time discovery bonuses are finite; new methods give selected familiar targets new work. Avoid global per-observation reward decay that eventually destroys all production. Routine programs support the economy; deeper programs drive new capabilities and stronger prestige.

### Cross-system loop examples

- Funded observations produce Data; analysis produces Knowledge; outreach/academy investment produces staff; staff increase Data and Knowledge throughput.
- Researchers turn evidence into Publications; Publications support grants; grants finance new instruments and larger academic cohorts.
- Engineers use Knowledge and Funding to build instruments; instruments open new measurement classes and programs.
- Space plus ground science earns Collaboration Credits; credits buy large improvements to processing, teaching, grant income, or engineering.

A new node initially consumes earlier outputs, then improves at least one earlier producer. It must introduce a new allocation or bottleneck, rather than merely rename a multiplier.

## 6. Central telescope progression and permanent roles

### The equivalent of the growing tower

The central visual spine is the telescope infrastructure: tripod → serious backyard setup → permanent enclosure → small dome → expanding observatory → mountain dome → large radio dishes → first orbital telescope → infrared flagship. Supporting institutions develop separately around this spine. Every major central milestone requires a mature combination of Funding, Knowledge, people, and eventually Engineering Progress.

These are progression milestones, not a claim that every later instrument is universally better. Radio adds another observing band; space adds a distinct environment and instrument suite. Survey cameras and robotic follow-up remain complementary instruments within the network.

| Stage | Central visual milestone | Scientific/economic capability | Retained role |
|---|---|---|---|
| T1 | 60 mm refractor on a tripod | Lunar and bright-planet observing, first records | Founding outreach instrument; optional equipped bright-star work |
| T2 | Larger 150–200 mm reflector, improved mount, camera and computer | Imaging, tracking, introductory photometry | Bright-target monitoring and teaching |
| T3 | Backyard permanent installation with opening roof | Reliable scheduled work; tracked 200–300 mm imaging instrument can be added | Monitoring and academic training |
| T4 | First compact dome with robotic 0.5–1 m telescope | Autonomous follow-up and flexible scheduling | Dedicated follow-up facility |
| T5 | Expanded dome/observatory with control-room extension and larger instrument | More capable observations and spectroscopy as modules unlock | Specialized observing programs |
| T6 | Mountain observatory with monumental dome and 8–10 m-class telescope | Faint-target spectroscopy and supported advanced modes | Major optical follow-up and characterization |
| T7 | Ground radio facility: first dish, then larger dish or bounded array expansion | Typed radio observations and suitable joint investigations | Complementary radio monitoring and science |
| T8 | First orbital observatory: integration building, launch, deployed telescope | Defined optical/near-infrared imaging and photometry suite above the atmosphere | Space monitoring and selected imaging programs |
| T9 | Infrared flagship: large folded telescope, sunshield, deployment, commissioning | Cryogenic infrared imaging/spectroscopy, suitable exoplanet and early-universe work | Final multi-instrument investigations |

Instrument sizes are representative design choices, not capability guarantees. Site, detector, mount, observing mode, exposure, and target properties still determine compatibility. T8 does not receive all flagship capabilities by default. T9 is a separate spacecraft, not an orbital upgrade purchased onto T8.

### Upgrade, relocate, or add a successor

Mounts, detectors, and compatible instrument modules improve an existing instrument. A new telescope purchase adds an instrument. Relocating a telescope into a permanent enclosure preserves its identity; commissioning a successor leaves its predecessor operational elsewhere. Larger dome stages may expand a facility or construct a successor dome, with the scene clearly showing where retained instruments now operate.

The view gradually pulls back from backyard to campus, then regional network and Earth/space. Remote mountain/radio sites are represented as linked locations, not forced into the original backyard. Older equipment remains inspectable with its role and contribution displayed.

### Visible construction projects

| Project | Paid milestones, each visibly represented | Operating payoff |
|---|---|---|
| Backyard enclosure | Pier/site → roof enclosure → power/control installation → scheduled-operation commissioning | Improved unattended utilization; no claim that the enclosure alone improves optical sensitivity |
| First dome | Foundation/pier → dome shell → telescope/mount → camera/control equipment → robotic commissioning | Reliable scheduled follow-up after its required equipment is complete |
| Observatory expansion | Added control space → larger instrument installation → analysis/control links → first light | Capacity and new compatible instrument modes |
| Mountain observatory | Site → monumental dome → mirror assembly → instruments/control → calibration/first light | Faint-target and specialized optical work |
| Radio facility | Site/receiver design → dish/mount → receiver/control → calibration → expansion | Suitable radio observations after commissioning |
| Orbital observatory | Design → spacecraft/instrument integration → launch → deployment/calibration | First functional space-science programs |
| Infrared flagship | Design → segmented telescope/instruments → sunshield/spacecraft integration → launch/deployment → cooling/calibration | Flagship infrared programs |

Costs draw on F, K, trained roles, and E where appropriate. Paid construction milestones persist through prestige. Benefits begin only when their actual dependencies are operational; an unfinished shell does not generate observations. Partial stages may increase a real capacity, such as integration slots, if explicitly defined.

### Supporting the next monument

- First enclosure: F, K, tracking and a trained operator.
- Robotic dome: F, analysis capacity, scheduling and staffed operations.
- Large/mountain observatory: grant income, E, researchers and suitable methods.
- Radio facility: E, receiver/analysis methods and operating allocation.
- Orbital observatory: integration capability, mission-qualified staff, F and E.
- Infrared flagship: advanced engineering, appropriate thermal/instrument design and prepared science programs.

The main infrastructure therefore summarizes progress across the economy. Funding alone cannot bypass institutions and capability development.

### Keeping the original telescope useful

Do not combine its photons with the mountain telescope as a generic sensitivity bonus. Its reliable role is outreach and recruitment, with a capped support contribution. A purchased camera/mount retrofit can enable suitable bright-star work. The scientific journal preserves its founding identity.

### Scope and specialties

Prefer a bounded set of distinct instruments and a few array expansions rather than unlimited identical purchases. Large-telescope time is reserved for demanding tasks while suitable smaller instruments supply monitoring and coverage. Arbitrary instruments cannot be combined into an interferometer; any array capability needs its own compatible design and review.

## 7. Core observing mechanics

### 7.1 Finding and tracking

The first interaction is a forgiving two-axis aiming control over a recognizable sky patch. A target guide narrows the search; settling on the target fills an observation bar. There is no precision reflex requirement.

The first observation is the Moon. The second can be Jupiter and its moons or Saturn’s rings. A stable mount reduces drift; motorized tracking removes repeated correction. A small queue then automates already-mastered targets.

Manual observing becomes optional. It does not remain the optimal way to earn currency five hours later.

### 7.2 Exposure and stacking

A camera creates frames that enter the processing queue. Integration reveals faint structure and reduces noise. Tracking limits usable exposure before trails spoil frames.

Choices: shallow survey, balanced observation, deep exposure. Show the consequences with simple labels rather than a photography settings panel.

Stacking improves signal-to-noise; it does not manufacture angular detail beyond the supported optics and sampling. A target too faint for practical exposure gets a clear capability warning instead of an endless progress bar.

### 7.3 Photometry and time coverage

The player now measures brightness over time. The light curve is the reward and the interface.

A variable-star program introduces periodic change. A suitable transit target introduces repeated dips, comparison stars, and a provisional planetary candidate. Repeated observations improve the period estimate and support follow-up.

Progress requires both measurement quality and temporal coverage. A giant single exposure cannot substitute for an entire light curve.

The campaign uses accelerated observing seasons. No real-time multi-day waits, daily login windows, or missable transit events.

### 7.4 Spectroscopy

A spectrum splits light into wavelength bins. Bright-star spectra teach that stellar light contains identifiable features. Later instruments tackle fainter objects or more demanding precision.

Spectroscopy is photon-hungry: more detail across wavelength can cost exposure time and throughput. Offer broad named modes, not dozens of controls.

Subsequent programs use spectral evidence to investigate composition, redshift, or stellar velocity. These are separate measurement requirements. A basic spectrum upgrade does not automatically enable precision radial-velocity work.

### 7.5 Surveys and candidates

Wide-field surveys generate a bounded candidate list. A candidate is an invitation to investigate, not a confirmed discovery or a loot item with random rarity.

Examples: periodic dimming, an object that brightened between visits, a plausible high-redshift galaxy selected from colors.

Candidate generation has deterministic milestone guarantees, so the campaign never depends on a rare random spawn. Optional variety can change names and parameters within vetted templates.

### 7.6 Coordinated follow-up

A simple priority scheduler connects surveys to appropriate instruments. Suggested policies: balanced science, complete current milestone, prioritize follow-up.

Example: wide-field camera flags periodic dimming → medium telescope measures additional events → suitably equipped observatory investigates false positives → large spectrograph obtains demanding follow-up where appropriate → space instrument studies an eligible atmosphere.

Not every candidate needs every instrument. A transient and a deep-field galaxy use different evidence graphs. Avoid presenting astronomy as one universal validation recipe.

### 7.7 Facilities and analysis

A darker site improves relevant observations. Better cameras and processing improve throughput. A robotic dome improves autonomous operation. An advanced large-telescope mode introduces adaptive optics as correction of atmospheric distortion under suitable conditions.

Facility upgrades must address visible bottlenecks. Anonymous staff allocation and academic training are core systems; individual staffing rosters are not. Do not add power grids, fuel supply chains, server thermal simulation, or building placement puzzles.

### 7.8 Space science: two separate milestones

The first orbital telescope introduces integration, launch, deployment, calibration, mission staffing, and a defined imaging/photometry suite. Give it several meaningful programs before the flagship arrives. The later infrared flagship adds its own funded design, integration, launch/deployment, cooling, and calibration stages. These are compressed projects, with no random catastrophic launch loss. Mission infrastructure and trained operations personnel help both projects; neither spacecraft is deleted by the next launch.

The new telescope opens selected infrared measurements. It is not simply the next magnification tier. Its observations remain complementary to ground-based surveys and follow-up.

The first orbital launch is a major payoff; the flagship first-light sequence is the larger late-game payoff: familiar sky → infrared composite → new evidence layers → science questions that the ground network helped prepare.

### 7.9 Radio observations

A commissioned dish produces radio Data using the same typed-inventory and analysis machinery, with appropriate receivers, calibration and target compatibility. Start with a small curated program, such as a suitable pulsar timing example or Galactic neutral-hydrogen observations, subject to target/instrument review. Progress comes from receiver and dish capability, coverage, analysis and coordinated programs. Do not present radio as greater optical magnification or require a new generic currency merely because a new band exists.

Radio adds joint-science options and engineering/analysis demand. It belongs to the intended visual progression, but it is not a scientifically required prerequisite for an optical spacecraft: space integration and radio projects share engineering prerequisites and can be developed in parallel. The default milestone guidance showcases radio first; a player may prioritize orbital construction.

## 8. Three cross-system examples

### A. A world around another star

1. Wide-field photometry identifies periodic dips around a fictional, appropriately bright star.
2. Smaller tracked instruments gather repeated light curves and refine the observing schedule.
3. Follow-up examines contaminating sources and plausible false positives.
4. Appropriate precision spectroscopy can constrain a sufficiently detectable companion’s mass; do not require radial-velocity detection for every planet.
5. An eligible transiting target becomes available to the infrared mission for atmospheric spectroscopy.
6. The result reports supported molecular evidence and uncertainty, not a guaranteed life detection.

**Economy interaction:** An inexpensive monitoring upgrade reduces wasted follow-up windows, increasing the effective output of the expensive space telescope.

### B. A changing star

1. The early telescope’s recurring bright-star observations build a long-baseline light curve.
2. A survey detects unusual behavior.
3. Automated scheduling requests a spectrum and denser sampling.
4. Combined evidence completes a stellar-variability program and unlocks improved classification.

**Economy interaction:** Early monitoring becomes useful again when later instruments can characterize a change. The result rewards complementary data rather than raw telescope size.

### C. The early universe

1. A deep multi-filter image produces a plausible distant-galaxy candidate.
2. Color selection is marked provisional.
3. Infrared spectroscopy supports a redshift determination in a suitable case.
4. Several targets form a small comparative science sample.
5. The final synthesis places measured properties in cosmic history, showing uncertainty and competing explanations where relevant.

**Economy interaction:** Survey processing finds useful targets; spectroscopy is the expensive bottleneck; improving selection reduces wasted follow-up. Do not imply a backyard telescope observes those galaxies directly.

## 9. Progression and unlock specification

### Unlock rules

The intended Tower Wizard-like rhythm is: **grow a familiar producer → expose a constraint → unlock a distinct producer → use its output to transform earlier production → prestige → push deeper**. This is our design structure, not a claim to reproduce Tower Wizard's exact costs or unlock order.

The table defines dependency order. Gates are accomplishments and capabilities, not elapsed-time locks. Purchasing a newly revealed facility still costs its listed resource types; exact amounts are prototype parameters. An "and" gate requires every stated prerequisite. Unlocked systems and installed infrastructure stay unlocked across prestige. Operational purchases and current program requirements reset as specified in section 13.

### Main unlock spine

| ID | Reveal/unlock condition | Purchase or action | New producer/resource | What changes; earlier-system payoff |
|---|---|---|---|---|
| U00 Backyard | New save | Free 60 mm telescope, seed F, founder work slot | Manual observations → D; self-analysis → K | The initial acquisition/analysis loop is visible |
| U01 Share the sky | First lunar record analyzed | Start outreach with F + K | Public Interest; donations convert allocated audience into F | Starter telescope gains an income-supporting role |
| U02 Hold the target | Lunar record and bright-planet record | Stable mount, then tracking with F + K | Autonomous target holding | Removes repeated corrections; improves usable observations |
| U03 Collect more light | Tracking and first outreach milestone | Buy 150–200 mm reflector with F; unlock camera design with K | Better observations; starter shifts to outreach | Two instruments now contribute differently |
| U04 Record faint light | Reflector and camera design | Buy camera and analysis workstation with F | Imaging D; queued analysis → K | Acquisition and processing become separate bottlenecks |
| U05 Teach the method | First processed image and Knowledge milestone | Open academy with F + K; allocate audience to recruitment | First trained generalists | Operators and analysts automate productive work |
| U06 Learn by doing | First generalist completes useful assigned work | Found team and buy mentoring with F + K | Expertise earned alongside useful work | Spend X on analysis, operations, or teaching specialization |
| U07 Train the next cohort | First trained person and mentoring | Teaching qualification with K + X | Teachers increase training throughput | A worker can increase future staffing instead of immediate output |
| U08 Measure change | Camera, analysis workstation, and one operator/analyst assignment | Photometric calibration and backyard enclosure stages with F + K; tracked imaging rig purchase available | Time-series D and evidence; recurring monitoring contract | Small instruments generate scientifically useful continuous work |
| U09 Write the first result | Complete a suitable variable-star evidence set under U08 | First research program with K + F and assigned researcher | First campaign Publication; science score S | Evidence becomes institutional progress; repeat sample programs become available |
| U10 Fund the institution | First Publication | Grant office with F + K | Recurring grants, bounded by campaign P and grant slots | Stronger F supports academy, processing, and operations; prestige becomes available |
| U11 Survey systematically | First Publication and functioning funded analysis | Wide-field camera array with F; survey pipeline with K + X | Survey D → processed candidates | Larger sky coverage supplies follow-up work to existing instruments |
| U12 Follow up automatically | First processed candidate and generalist researcher | Compact dome and robotic 0.5–1 m telescope in F-funded stages; routing upgrades with K + X | Automated candidate investigations | Monitoring refines schedules; follow-up converts opportunities into evidence |
| U13 Build our own tools | Robotic facility and one completed follow-up program | Engineering lab with F + K; qualify generalists using K + X | Engineering Progress | E buys hardware that changes observing and analysis capability |
| U14 Read starlight | First engineering prototype and suitable telescope | Observatory expansion and entry spectrograph with F + E; methods with K | Spectral D and composition/classification programs | Familiar bright stars become new investigations; spectral analysis demands processing |
| U15 A major observatory | Engineering lab, a spectral program, and two completed science families | 8–10 m project in F + E stages | Faint-target spectroscopy; new specialized programs | Research output improves grants; small instruments retain monitoring/survey roles |
| U16 Precision methods | Large observatory and qualifying spectral work | Separate precision-RV or AO modules with F + E + K | Specialized velocity or angular evidence | Opens selected investigations; neither module is universal or required for every target |
| U16R Listen to the sky | Large-observatory engineering capability and receiver-method study | Dish/receiver project with F + E; radio analysis with K | Radio D and curated radio science | New engineering and joint-analysis opportunities; dish expands visibly |
| U17A First orbit | Large observatory, spectral program, and completed spacecraft design study | Orbital mission: integration, launch, deployment, calibration; qualified mission staff | Space imaging/photometry D and several programs | First space milestone; ground monitoring supports mission scheduling |
| U17B Infrared flagship | Commissioned U17A, one completed orbital program, advanced thermal/instrument study | Separate flagship build with F + E, launch/deployment and cooling/calibration | Infrared D and advanced program families | Existing mission staff, engineering and ground preparation support a much larger project |
| U18 Join the evidence | Commissioned U17B and one ground-supported IR investigation | Joint science center with F + K; first combined program | Collaboration Credits | A new specialist currency buys major boosts to early and middle systems |
| U19 Transform the network | First C earned | Choose shared compute, fellowships, instrumentation, or long-term funding | Large campaign-wide multipliers | Earlier producers scale sharply; improves final science and Legacy earning |
| U20 Complete the program | U18 plus the three final evidence programs in section 13 | Final synthesis with budget and researcher time | Grounded ending | Whole-network contribution is shown; no speculative discovery required |

Entry spectroscopy is intentionally placed after engineering in this campaign, not because amateur spectroscopy is scientifically impossible earlier. This is a design unlock order.

### First cycle: specific sequence to prototype

1. Observe and analyze the Moon; buy outreach. Donation income becomes sustainable.
2. Record a bright planet; buy stable mount and tracking.
3. Choose between outreach expansion and saving for the reflector. Both should pay back before the first campaign ends.
4. Purchase reflector, camera, and workstation. Assign the founding telescope to outreach.
5. Open academy; train two generalists. Assign one to observations and one to analysis, releasing founder time.
6. Earn X through completed useful work. Choose an operations or analysis specialization; teaching is a competing longer-payback investment.
7. Purchase photometry; complete a variable-star program with existing instruments. A founder/generalist can do its researcher role, so no specialist deadlock exists.
8. Complete first Publication; open grants and reveal prestige plus the wide-field project.
9. Compare saving for survey expansion against concluding the campaign for an immediately useful Legacy package.
10. On prestige, retain hardware, people, methods, automation, and lifetime unlocks; rebuild audience and campaign output rapidly.

Start with one worker pool, three jobs, and one publication template. Add teachers after basic assignments make sense. The first campaign is the complete economic test slice, not just an observation tutorial.

### Lifetime pacing with prestige

These are unverified targets for the first playable balance. Campaigns are not mandatory chapter locks. A strong player may push deeper before resetting or finish with fewer resets. No unlock checks prestige count or a Legacy-only ability.

| Campaign / elapsed-play envelope | Expected new frontier | Intended slowdown | Suggested prestige benefit |
|---|---|---|---|
| First, ~0–45 min | U00–U10: observing, analysis, academy, first grant | Staffing and processing lag behind desired expansion | First payout buys ~2× Funding and ~2× processing; rebuild previous output in ~5–8 min |
| Second, ~45–105 min | U11–U12: surveys and robotic follow-up | Candidate handling and research capacity | Recruitment/teaching and scheduling improvements |
| Third, ~105–185 min | U13–U15: engineering, spectra, large telescope | E production and facility scale | Engineering and program-throughput improvements |
| Fourth, ~185–280 min | U16/U16R/U17A: precision work, radio, first orbit | Receiver/integration cost and advanced analysis | Stronger grants, engineering, and retained operational readiness |
| Fifth, ~280–420 min | U17B–U20: infrared flagship, joint science and final synthesis | Complementary evidence throughput | Finish, or take one more prestige if its payoff beats waiting |

The final space/joint-science stage must have meaningful playable duration. Do not spend five hours constructing the space telescope and end immediately after launch.

### Re-entry after prestige

Previously mastered systems remain visible, with locked new frontiers previewed. A free basal donation and self-analysis mode restart F and K. Retained staff can resume supported tasks immediately. The player restores campaign operations in a few grouped purchases, not by replaying the tutorial. Permanent auto-buy rules can handle mastered operational upgrades; meaningful current-campaign allocation choices remain.

### Branching without a content explosion

Between U10 and U17B, offer parallel investment in academic throughput, grant income, engineering output, and observing/analysis. The main dependency spine remains legible, but purchases need not follow a single optimal order. Optional precision-RV and AO branches add different eligible programs. Never require both simply to inflate the tree.

## 10. Upgrade families and scaling contracts

Each producer has its own growth curve. Within-family levels may scale gradually; cross-system milestones should create conspicuous leaps. Values here are candidate prototype effects, not measured balance.

| Family | Repeatable campaign investment | Discrete breakthrough | Older-system interaction |
|---|---|---|---|
| Outreach | F: event capacity and materials | K: educational program; X: outreach practice | Raises donations/recruitment using early equipment |
| Observing | F: operating allocation and acquisition efficiency | K: scheduling; E: installed detector/instrument | Data for analysis and science |
| Analysis | F: processing allocation; K: reduction efficiency | X: team specialization; C: shared infrastructure | Converts acquisition growth into K instead of backlogs |
| Academy | F: cohort capacity; K: curriculum | X: teaching specialization; C: fellowships | More staff in all productive jobs |
| Teams | K + F: mentoring allocation | X: operations, analysis, teaching, research, engineering tracks | Different bottlenecks reward different specializations |
| Scientific programs | F + K: program capacity | X: program efficiency; qualifying hardware opens new families | More P supports grants and stronger prestige |
| Grants | F + K: administration efficiency | Publication thresholds open additional grant slots | Sustainable F funds all other producers |
| Engineering | F + K: engineering project allocation | X: engineering practice; E: instrument hardware | New tools and capabilities, not just generic output |
| Joint science | F + K: coordination | C: shared compute, fellowships, instrumentation, long-term support | Large multipliers to earlier systems |

Candidate C upgrades: shared compute ×3 processing, fellowships ×2 training, shared instrumentation ×2 E output, long-term support ×3 grant income. Costs increase within a campaign; their effects reset on prestige. Installed hardware purchased with E is permanent. Legacy upgrades are a separate permanent layer.

### Production rules for the numerical prototype

- Each job recipe declares inputs per work unit, outputs, capacity, worker requirements, compatibility, and modifiers. Actual progress is bounded by all required inputs and available capacity.
- A telescope has a base acquisition rate; operators/software improve utilization, not photon physics. Scientific capability gates remain separate from economic output multipliers.
- Analysis consumes typed D and F to produce K and linked evidence. Throughput is the minimum of available data and processing capacity. Different data types have explicit costs and yields.
- Academy training is bounded by applicants, cohort seats, teacher/founder capacity, and allocated F/K. It creates a person only after a complete funded training cycle.
- X accrues from useful funded work, with a throughput cap. Idle staff, blocked jobs, and pointless assignment switching earn none.
- P is awarded once per completed distinct program instance. Repeat programs require fresh eligible evidence. Grant income depends on current P thresholds and active slots, not consuming P.
- Engineering consumes F and K and requires assigned qualified staff. Staged builds cannot consume more E than available. Partial construction survives campaign closure as installed project progress, so prestige never deletes paid-for hardware work.
- C requires qualifying complementary evidence. It cannot be farmed by relabeling the same observations.
- Modifiers stack by documented categories. Within a category prefer additive bonuses; multiply separate categories deliberately. Record marginal payback and avoid accidental unlimited feedback.
- Every consumer shows budget draw. If F runs out, jobs throttle according to player priorities; free bootstrap jobs remain available.

Diminishing returns apply to easy repeat prestige scoring, excessive audience accumulation, and escalating upgrade costs—not to destroying the ordinary resource engine. There must always be a productive path forward.

## 11. Scientific model and deliberate abstraction

### Lightweight internal model

Do not implement a complete optical or astrophysical simulator. Give each observation task explicit requirements and an understandable efficiency model.

For suitable simplified imaging cases:

- Collected source counts scale with collecting area, throughput, target flux, and exposure.
- Collecting area scales approximately with aperture diameter squared, allowing for obstruction and throughput separately.
- Signal-to-noise can use source counts divided by the square root of source counts, background counts, and detector variance.
- In an appropriate photon-noise regime, signal-to-noise improves approximately with the square root of exposure time, not linearly.
- Angular resolution has a wavelength/aperture dependence; ground performance also depends on atmosphere and observing mode.

Do not apply these approximations indiscriminately to surface brightness, photometric precision floors, spectroscopy, or resolved-source performance. Use curated task coefficients and validated capability gates.

At implementation time, source and review quantitative formulas before tuning them. The game should explain qualitative consequences correctly even where balance uses compressed numbers.

### Evidence graph

Each task defines:

- Target and whether it is real or fictional.
- Measurement type and supported observing bands.
- Brightness class, resolution requirement, and instrument compatibility.
- Required integration and/or time coverage.
- Calibration or supporting evidence prerequisites.
- Completion rewards and repeat-value policy.
- Scientific statement permitted by completion.
- Source notes, simplifications, and uncertainty wording.

Visibility unlocks are campaign access and interface pacing, not claims that nearby objects are inherently discovered before distant bright objects.

## 12. Scientific accuracy rules

| Topic | Required treatment | Avoid |
|---|---|---|
| Aperture | Light collection and potential angular resolution | “More magnification” as the universal upgrade |
| Appearance | Eyepiece views differ from long exposures and processed composites | Colorful nebula photographs presented as normal eye views |
| Imaging | Display observation mode and wavelength mapping | Invisible wavelengths described as naked-eye colors |
| Transits | Dimming supports a candidate; depth and interpretation depend on assumptions | A dip automatically proves a planet or life |
| Radial velocity | Specialized precision measurement; mass constraints depend on geometry and data | Every basic spectrograph weighing Earth analogues |
| Spectra | Evidence about composition and conditions with limitations | One spectral line establishing an inhabited planet |
| Distant light | Looking back in time because light travels finitely | Seeing the present state of a very distant galaxy |
| Cosmology | Distinguish redshift, lookback time, and different distance definitions | One “distance” number used interchangeably for all three |
| Webb inspiration | Primarily infrared, cooled and shielded, operating around Sun–Earth L2 | An ordinary visible telescope sitting motionless at L2 |
| Space vs ground | Complementary access, backgrounds, apertures, and specialties | Space automatically superior at every observation |
| Interferometry | Only for compatible equipment and a designed observing system, if added later | Pooling arbitrary backyard telescopes into a giant filled mirror |
| Adaptive optics | Atmospheric correction with limits | Removing clouds or all light pollution |
| Scientific uncertainty | Candidate, supported measurement, and interpretation distinguished | Fixed confidence bars pretending to be universal statistical proof |
| Known objects | Player observes or learns established facts | Claiming to be humanity’s first discoverer of Saturn’s rings |

Game time, construction cost, institutional scale, schedules, and processing are overtly compressed. A novice-to-space-agency journey is a fantasy of scientific growth, not a realistic career simulator.

Use a brief optional “What is real?” note on each major capability. Keep deeper explanations in the journal so they do not interrupt play.

## 13. Central prestige loop and ending

### Conclude a campaign

Prestige unlocks at U10 after the first Publication and grant office establishment. The player closes the current observing campaign, converts its scientific accomplishments into Legacy, spends permanent bonuses, and starts new observing programs with the retained institution.

Expected first completion uses three to five resets. Waiting without prestige remains possible because every required capability uses ordinary production resources; no stage is locked behind reset count or Legacy spending. Exact no-reset completion time must be measured rather than asserted.

### Reset contract

| Retained | Reset or restarted |
|---|---|
| Telescopes, facilities, installed modules, paid construction stages | F, K, X, E, C unspent balances and D queues |
| Trained people and attained role qualifications | Public Interest audience; donation/recruitment allocation can be restored |
| Tracking, software automation, method access, lifetime unlocks | Campaign operational efficiency levels and X specializations |
| Permanent journal, archived publications, discovered objects | Current P count, active grant awards, unfinished science-program evidence |
| Legacy balance and purchased Legacy upgrades | Campaign C improvements and S score |
| Saved assignment policies and auto-buy rules | Active jobs pause until startup budgets support them |

Any retained K method unlock is distinct from a resettable operational method level. Each upgrade definition declares one persistence class: installed hardware, permanent method/automation, permanent qualification, campaign operation, campaign specialization, campaign collaboration, or Legacy. The preview lists all losses, including unfinished evidence, and estimated restart income. Archive completed findings before clearing program state.

Retained people and hardware make this a softer infrastructure reset than a full rebuild. Therefore audience, grants, campaign operations, and specialist multipliers must form a substantial share of mature income. Otherwise prestige has no meaningful rebuilding phase. If rebuilding becomes trivial after several resets, the new frontier should take over, not force artificial delays or delete the network.

### Payout model to test

Use completed-program score rather than current currency balances or telescope purchase value. Spending currency should not reduce prestige; hoarding money should not be the dominant payout strategy.

Each completed program gives score according to depth, evidence complexity, and scientific family. Repeating the same easy family has diminishing scoring weight within a campaign while retaining normal economic rewards. New lifetime depth milestones also award a one-time Legacy bonus on campaign closure. Repeated observing campaigns use fresh datasets and samples, never re-discover established facts.

Candidate starting formula: `Legacy gained = floor(4 * sqrt(S / S_first)) + unclaimed depth bonuses`, where `S_first` is the score of the first complete starter campaign. This gives four points at that reference campaign. It is a test hypothesis, not a balance result. Preview the payout continuously and test Legacy/minute against short-reset exploits. Adjust the repeat-scoring and depth terms if opening-loop farming dominates; do not assume the square root alone fixes it.

### Permanent Legacy branches

| Branch | First candidate purchase | Later development |
|---|---|---|
| Established support | 2 L: ×2 baseline donations and grants | Larger start budget, higher income multipliers |
| Proven pipelines | 2 L: ×2 processing capacity | Better routine analysis and queue management |
| Academic network | 2 L: ×2 recruitment/training throughput | More starter readiness and stronger teaching |
| Engineering heritage | Available after U13: ×2 E throughput | Procurement reductions and build efficiency |
| Experienced operations | Available after first closure: auto-buy selected mastered campaign levels | Saved budget/assignment presets and reduced routine recovery |
| Coordinated research | Available after U12: improve program-work throughput | Better complementary-evidence utilization |

First reference payout buys support and pipelines together, or a different useful package. No permanent branch bypasses wavelength, precision, brightness, or resolution requirements. Software and staffing efficiency are abstractions of institutional capability.

### Grounded final objective

Complete **The Connected Observatory Program** after U18:

1. A changing-star study using the long-running ground network.
2. A suitable fictional transiting exoplanet investigation with defensible atmospheric evidence where achievable.
3. An early-universe galaxy sample with supported infrared measurements.

Final programs require fresh campaign evidence from retained instruments, not deletion of historical discoveries. The ending shows the network's contribution history and returns to the original telescope. Life detection, proof of a multiverse, and direct imaging of the Big Bang are not required.

A speculative continuation may be added later, clearly labeled before fictional physics or artificial signals appear. Prestige belongs to the grounded main game and needs no science-fiction justification.

## 14. Presentation and solo-development scope

### Central progression plus independent institution visuals

1. **Telescope/network view:** The central instrument project dominates the scene. Show current construction stage, next milestone, first-light status, and the older instruments still contributing. Pull back in scale as the network grows; Earth/space nodes appear for the two distinct spacecraft.
2. **Institution panels:** Each institution has its own evolving visual, resource counters, rates, assignments, and upgrade group. Selecting a building opens that system directly.
3. **Observation workspace and journal:** Reusable target image/diagram, light curve or spectrum, evidence, methods, permanent discoveries and scientific notes.

| Institution | Separate visual progression | Grouped resources and upgrades |
|---|---|---|
| Outreach | Table/demo area → visitor room → public science center | Interest, donation allocation, recruitment |
| Analysis center | Laptop → workstation room → computing facility | Data queues, Knowledge, processing |
| Academy | Informal class → classrooms → astronomy institute | Students, people, teachers, training |
| Research institute | Shared office → laboratories → research campus | Expertise, Publications, program capacity |
| Grant office | Administrative desk → office → institutional headquarters | Grant slots, net Funding, support agreements |
| Engineering lab | Workbench → instrument workshop → integration facility | Engineering Progress, hardware and construction projects |
| Mission operations | Small control room → dedicated mission center | Mission-qualified staff, deployment, scheduling, spacecraft status |
| Collaboration center | Meeting room → international research hub | Collaboration Credits and shared network upgrades |

Buildings reveal with their associated economic system. Mission operations reveals during U17A preparation; the collaboration center reveals at U18. Mission staff qualification is a K/X investment for trained people, not a new population type. These visuals group existing mechanics rather than add rent, placement, or individual-building simulations.

Use a compact objective strip and progressively revealed resources. Panels expose inputs, outputs, net rates, shortages, assignments, upgrades and persistence. Currency use across institutions is explicit: a resource can be generated in one panel and spent in another.

### Manageable art budget

- Nine central milestone silhouettes, with modular construction states rather than unique detailed illustrations for every step.
- Dome shells, telescope assemblies, control annexes and dish components reused compositionally.
- Eight institution icon/silhouette families, each with two or three modest stages; no bespoke walkable interiors.
- One layered ground panorama, linked remote-site representations and a reusable Earth/space backdrop.
- Two spacecraft silhouettes and distinct deployment sequences, with greatest polish reserved for launch/first light.
- Procedural star fields and reusable target renderers, light curves and spectra.
- Approximately 20–30 curated target entries, expanded only when the economy needs them.

This is a larger art scope than draft 0.2. Keep structures stylized and vector-like or pixel-based. Validate every construction stage as text/state first in the numerical POC; no illustrations are required to test costs, dependencies, persistence or benefits.

Images remain explicitly labeled as diagrams, artist impressions, eyepiece simulations, or processed observations. Procedural illustration must not masquerade as measured data. Visual progression communicates institutional growth, not a claim that radio or space replaces all earlier capabilities.

## 15. Simulation-first implementation shape

Keep content data-driven. Separate instrument capabilities, task/evidence definitions, economy balancing, unlock dependencies, and presentation.

A deterministic, interface-independent simulation advances observing, processing, training, staffing, budgets, evidence, programs, and prestige. Define explicit update ordering or a consistent event system so changing tick size does not create free resources. A slower scheduler assigns compatible work. Saves retain instruments, people, persistence classes, assignments, unlocks, queues, evidence, milestones, Legacy, and the simulation/content version.

Use seeded variation only for vetted optional targets. Mandatory milestones remain deterministic and reachable. Include migration support once public saves exist. Offline progress, if included, should have a documented cap and process existing assignments rather than inventing unreviewed discoveries.

The framework/language decision remains open. This plan does not require a heavyweight engine or real-time 3D.

## 16. Graphics-free proof of concept and balancing

### Stage A: one complete prestige cycle

Implement U00–U10 using plain counters, buttons, job assignments, progress bars, and an event log. Include outreach, academy, X specializations, photometry, first Publication, grants, Legacy purchases, and restart. Telescope targets can be named tasks with explicit requirements; no art, aiming interface, astronomical image rendering, or framework/engine commitment is needed.

The interaction is acquire → analyze → invest → assign → complete a program → prestige → rebuild faster. Test this before final visual observing interactions. A small text interface is sufficient, but must be playable as well as simulatable.

### Stage B: interdependence and new currencies

Add U11–U15: survey candidates, robotic follow-up, engineering, spectroscopy, and large-facility projects. Verify at least two viable investment strategies and useful continued roles for early instruments. Then add radio, first orbit, the separate infrared flagship, C production, final programs, and a full three-to-five-reset run. Represent every construction milestone and institution stage as a plain state label before adding visuals.

### Required visibility

Show totals, gross/net rates, caps, input shortages, per-node contributions, upgrade effects, estimated payback, unlock prerequisites, and prestige preview. Log when the limiting resource changes. Simulation speed controls and reproducible saves support development testing.

### Numerical checks

| Check | Pass condition or measurement |
|---|---|
| Accounting | No negative resources, duplicate rewards, or created/deleted people through reassignment |
| Reachability | All mandatory unlocks reachable with ordinary resources, both with prestige and without it |
| Bootstrap | Zero F after a reset still recovers through the free starter path |
| Time-step consistency | Comparable results for small ticks, larger ticks, and accelerated runs within declared tolerances |
| Staffing | Teaching and specialization pay back in plausible situations; inactive staff earn no X |
| Budgeting | Shortages throttle work predictably, never create debt, and recover when income resumes |
| Prestige persistence | Every resource/upgrade follows its declared reset class; paid hardware and trained people survive |
| Rebuild payoff | First prestige surpasses previous output in the target ~5–8 minutes, subject to tuning |
| Strategy diversity | Compare cheapest-first, payback-first, milestone-focused, academy-heavy, and engineering-heavy policies |
| Reset exploits | Compare Legacy/minute at different closure points; repeated opening runs must not dominate all depth |
| Bottleneck movement | Acquisition, processing, staff, F, E, and specialized evidence each matter at different frontiers |
| Old equipment | Earlier instruments retain useful measurable contributions without bypassing scientific compatibility |
| Parameter sensitivity | Identify costs/rates where small changes cause deadlock, runaway growth, or severe stalls |
| Completion pacing | Measure first-run completion, reset count, no-reset time, idle time, and playable space-stage duration |

Do not write tests that simply repeat formulas without checking behavior. Use conservation, boundary, reachability, persistence, and representative progression scenarios. Automated agents reveal problems but do not prove optimality or fun.

### Human playtest questions

Can a player explain why the academy initially costs output and later accelerates everything? Does each currency unlock feel consequential? Are there interesting purchases during a slowdown? Does prestige feel like an attractive investment rather than lost work? Does the new system change how an older one is used? Is the plain numerical game enjoyable before visual rewards exist?

Scientific review still checks instrument compatibility and inference language. Mathematical correctness cannot establish experiential balance or scientific accuracy by itself.

## 17. Decisions still open

Recommended defaults are included so the next draft can progress without resolving everything at once.

| Decision | Recommended starting point |
|---|---|
| Tone | Warm scientific wonder, restrained interface, light narrative |
| Campaign length | Prototype a 5–7-hour outline; reduce rather than pad |
| Main input | Mouse/touch-friendly aiming and assignment; no reflex timing |
| Simulation calendar | Accelerated observing seasons with forgiving recurring opportunities |
| Real vs fictional targets | Real teaching targets; clearly fictional research cases |
| Prestige | Central campaign-reset economy; target three to five resets; no reset-only mandatory gates |
| Central progression | Backyard → permanent enclosure → expanding domes → mountain telescope → radio facility → first orbit → infrared flagship; earlier instruments retained |
| Institution visuals | Separate evolving silhouettes and resource/upgrade panels |
| Final mission | Separate fictional Webb-inspired flagship after the first orbital telescope; real constraints represented selectively |
| First release scope | Grounded campaign only; speculative continuation deferred |

The system order and dependency gates are now specified in section 9. Next assign numerical starting rates, recipe costs, upgrade curves, program scores, and Legacy costs for U00–U10; simulate and play that complete prestige cycle before locking later prices. Keep language/framework/engine decisions open until the economic loop is validated.

## 18. Scientific references and review notes

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
