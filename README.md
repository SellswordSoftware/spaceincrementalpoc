# Eyes on the Universe

An incremental astronomy prototype built around independent stations, one Data
wallet, permanent investments and optional prestige. Click or hold to help a
station while every purchased producer continues working.

## Run locally

Use Node.js **24.16.0**, pinned in `.node-version` and `.nvmrc`.

```sh
npm ci
npm run dev
```

Open <http://127.0.0.1:5173>. Set `PORT` for another port. Native JavaScript
modules run directly; no framework, bundler or runtime dependencies are required.

## Publish on GitHub Pages

The [Pages workflow](.github/workflows/pages.yml) builds and deploys on pushes to
this repository's default branch. It also supports manual runs from **Actions →
Deploy game to GitHub Pages → Run workflow**, selecting the default branch.

1. Push this project, including the workflow and `package-lock.json`, to GitHub.
2. In the repository, open **Settings → Pages → Build and deployment** and select
   **GitHub Actions** as the source.
3. Run the workflow or push another commit to the default branch. The deployment
   job's environment link and **Settings → Pages** show the published URL.

The workflow installs the pinned Node version, runs the existing checks/tests,
builds `dist/` and publishes that directory using GitHub's Pages actions. It uses
GitHub's built-in token; no personal access token or deployment secret is needed.
The branch condition follows the repository's default branch automatically.
See [GitHub's Pages workflow setup](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages).

```sh
npm run build
```

`dist/` contains only the game shell, stylesheet and browser modules. Relative
asset URLs work at both a domain root and a project path such as `/repository/`.
No application server is needed in production. Hosted saves live in that browser's
local storage; use Export/Import to transfer a local development save to the site.

## Resource flow

| Resource | Produced by | Its role |
|---|---|---|
| Data | Ground, radio and space telescopes | Instant analysis, research-team purchases, joint teams and final synthesis |
| Knowledge | Instant Data analysis and archive research | Target research, equipment, institutional methods and producer investment |
| Interest | Outreach activities and active sharing | Permanent supporter groups and opening Academy |
| Funding | Supporter groups, appointed fundraisers and grants | Equipment, staff teams, facilities and missions |
| People | Academy classrooms | Permanent appointments throughout the network |
| Expertise | Research institute, mentoring and researchers | Required calibration/operations/integration methods and station practice improvements |
| Publications | Ground science teams, space telescopes and joint teams | Cumulative qualifications for grants, facilities, missions, joint programs and the ending; never spent |
| Engineering Progress | Workshop benches, engineers and active development | Observatory construction, instruments and missions |
| Collaboration Credits | Joint science teams | Network production improvements and final synthesis |
| Insight | Concluding a run through prestige | Permanent global modifiers bought between runs |

**Data/s = installed observing capacity × frontier yield × observing bonus.**
Researching Moon → Jupiter → Saturn → clusters → nebulae → galaxies → radio
sources → transit targets → infrared fields → early-galaxy fields increases the
frontier multiplier on the same Data stream. Older equipment keeps contributing.
The multiplier represents network productivity, not a claim that every small
instrument can directly observe every target.

## Playing through the network

1. Click/hold **Observe the sky**, buy an observing routine, then open Analysis.
   Analyze Data for immediate Knowledge or add archive research for passive income.
2. Open Outreach and Support. Spend Interest on supporter groups, Funding on
   telescopes, and Knowledge on better targets and equipment.
3. Tracking opens Engineering early. Build a reflector and enclosure before Academy,
   then progress through robotic dome, expanded observatory and mountain telescope.
4. Academy's founding classroom graduates every **40 seconds**. Teaching teams add
   independent classrooms. Funding/Knowledge prices triple per added team; practice
   and Insight increase graduate rewards, keeping the timer fixed.
5. The first graduate reveals Research. Mentoring and researchers produce Expertise.
   Develop photometry for continuous Publications, add research teams and improve
   science practice to build the scientific record faster.
6. Spend Expertise on **advanced calibration** (5 Publications), **orbital operations**
   (30), **infrared calibration** (1,000) and **network integration** (1,000). These enable
   the spectrograph/mountain telescope, optical payload, flagship mirror and ending.
7. Publications open grants, then qualify research grants at **15** and flagship
   grants at **100**. Grants add **2 / 4 / 8 base Funding/s**, respectively. All tiers
   share `floor(Publications)` slots. Buying grants never spends Publications.
8. Build radio instruments and the optical orbital telescope, then a distinct cooled
   infrared flagship. Each commissioned mission immediately adds continuous Data
   and Publications. Earlier ground and space instruments remain productive.
9. At **400 Publications**, the commissioned orbital telescope, radio observatory
   and Research enable Joint science. Complementary programs connect ground/radio,
   orbital/spectroscopic and mountain/infrared capabilities.
10. Joint teams continuously earn Credits and Publications. Add more teams or improve
    collaboration/science to scale output; each team permanently appoints one graduate
    and its stock costs grow **60%** per purchase. Credits buy network improvements.
11. Establish all three joint programs, develop network integration, reach **5,000
    Publications**, then pay **100,000,000 Data + 1,000,000 Funding + 100,000 Knowledge +
    100,000 Engineering + 500 Credits** to complete synthesis immediately. The browser
    pauses and shows the ending; **Keep observing** resumes production.

Only Academy has producer countdowns. Ground science, missions and joint teams
produce fractional rewards continuously. Synthesis has no countdown. Waiting comes
from accumulating resources, and investments increase production. Producers have no
recurring wallet costs, wages, allocation percentages or restart clicks.

## First prestige pacing

The first reset decision is intended around **10 minutes at normal 1×**: complete
nebula research, the robotic dome and the first grant. The expanded observatory
then makes a substantial economic step, with steeper mountain/radio/space tiers
beyond it. No content requires a previous reset. A highlighted prestige button
and saving estimate suggest rebuilding when the next expansion is expensive;
investing in this run remains available.

Prestige pays **5 base Insight** plus the Publication bonus. **Engineering heritage**
starts at 2 Insight and doubles Engineering and Collaboration production per level.
Research and flagship grants yield **4 / 8 Funding/s** with 80% stock price growth.
The opening, later prices and scientific record requirements now support repeated
rebuilding rather than a quick first-run finish.

`npm run scenario:pacing` measures attentive play using earned resources and actual
clicks, analysis and reinvestment: **9:26.5** to the first reset, **6 Insight**, then
**5:09.25** to rebuild with Engineering/support/research modifiers. This is one
reference policy; faster investment choices can reach it earlier. It is not a
hard ten-minute lock or a final total-game-duration target. Existing saves retain
all progress and purchased levels; the new curve applies to future production
and purchases. Start fresh to assess the first-prestige target.

## Finding new options

An unlocked, unreviewed option gets a **New** row marker, a gold station icon and
an **N new · Review** button. Review jumps to the next new row. Clicking or focusing
a row acknowledges it without buying, even when it is unaffordable. Scrolling past
it does not clear it. Wallet changes and later repeat purchases do not create new
notifications. Publication qualification can unlock a new option; merely affording
its price cannot. Unlock feedback names both the option and destination station.
Review state survives save/reload and resets at prestige.

## Prestige and saves

Every system and the ending remain reachable in the first run. Prestige becomes
available after nebula research, building the robotic dome and securing an observing grant. Review the reset,
conclude the run and spend Insight between runs. All ordinary currencies, purchases,
people, discoveries, classroom phases and the ending reset. Only Insight upgrades
and unspent Insight carry forward. No capability requires previous prestige.

Insight boosts Data, Knowledge, support, Expertise, science, Engineering and
collaboration. Teaching factors are milder: Institutional memory gives ×1.2 teaching
per level while retaining ×2 Research/science; Connected thinking gives ×1.05
teaching and ×1.25 other production. Classroom timers stay fixed.

Autosave runs locally; reload/import resumes paused. Export JSON for a portable
copy. No offline progress. Import validates before replacing the current game.
Bundled prior saves (schemas 6–14) migrate their purchases and wallets. Old science
phases and fractional reward banks convert into accrued Publications/Credits.
Existing joint teams retain dedicated staff without taking previously unassigned
graduates. Already-paid synthesis completes on migration. Earlier construction
remains owned even if this revision adds requirements to future purchases.

## Verification and status

```sh
npm run check
node --test test/stations.test.js
npm run scenario:progression
npm run scenario:pacing
```

One progression integration test covers the ordinary-command first-run route,
continuous science/Credits, required methods, review persistence, immediate ending
and full reset. `npm test` also includes the existing server/import smoke checks.
Individual station/prestige/engineering/horizons/synthesis scenarios remain available.
They use actual commands and earned resources, with no seeded wallets. Reference
policies demonstrate reachability, not optimal play or a balance target. The first prestige is tuned toward ten minutes at 1×; later pacing needs further
human playtesting. +time and 20× controls remain available for development.

The browser and scenarios share a runtime-neutral deterministic core. Commands
include purchases, active assistance, instant Data processing, option review and
prestige transitions. Read-only quotes/previews never mutate game state.

See the [game design](eyes-on-the-universe-game-plan.md),
[implementation plan](eyes-on-the-universe-prototype-implementation-plan.md), and
[findings](findings.md).
