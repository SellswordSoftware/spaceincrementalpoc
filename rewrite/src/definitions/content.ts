import type { Investment } from "../core/types.ts";
type Purchase = Omit<Investment, "kind" | "growth" | "maxLevel" | "output"> &
  Partial<Pick<Investment, "kind" | "growth" | "maxLevel" | "output">>;
const investments = (items: Purchase[]): Investment[] =>
  items.map((item) => ({
    kind: "unlock",
    growth: 1,
    maxLevel: item.kind === "appointment" ? 1000 : 1,
    output: {},
    ...item,
  }));
import type { Definitions } from "../core/types.ts";
import { resources } from "./resources.ts";
export const definitions: Definitions = {
  contentVersion: "0.16.0-pacing",
  resources,
  insightUpgrades: [
    {
      id: "engineering-heritage",
      name: "Engineering heritage",
      stats: ["engineering", "collaboration"],
      factor: 2,
      cost: 2,
      growth: 2,
      maxLevel: 6,
      description:
        "Double Engineering Progress and Collaboration Credit production and active engineering yield per level.",
    },
    {
      id: "expansive-observing",
      name: "Expansive observing",
      stats: ["observing"],
      factor: 2,
      cost: 2,
      growth: 2,
      maxLevel: 6,
      description: "Double all passive Data and observing assistance per level.",
    },
    {
      id: "clear-analysis",
      name: "Clear analysis",
      stats: ["analysis"],
      factor: 2,
      cost: 2,
      growth: 2,
      maxLevel: 6,
      description: "Double passive Knowledge and instant Knowledge per Data per level.",
    },
    {
      id: "shared-enthusiasm",
      name: "Shared enthusiasm",
      stats: ["outreach", "support"],
      factor: 2,
      cost: 2,
      growth: 2,
      maxLevel: 6,
      description: "Double Interest and Funding production, including active help, per level.",
    },
    {
      id: "institutional-memory",
      name: "Institutional memory",
      stats: ["teaching", "research", "science"],
      factor: 2,
      factors: { teaching: 1.2 },
      cost: 2,
      growth: 2,
      maxLevel: 6,
      description:
        "+20% graduate rewards per level; double Expertise production and Publication production per level. Academy timers stay fixed.",
    },
    {
      id: "connected-thinking",
      name: "Connected thinking",
      stats: [
        "observing",
        "analysis",
        "outreach",
        "support",
        "teaching",
        "research",
        "science",
        "engineering",
        "collaboration",
      ],
      factor: 1.25,
      factors: { teaching: 1.05 },
      cost: 1,
      growth: 2,
      maxLevel: 8,
      description:
        "+5% graduate rewards per level; multiply all other production and assistance by 1.25 per level. Academy timers stay fixed.",
    },
  ],
  finale: {
    investmentId: "network-synthesis",
    name: "Eyes on the Universe",
    description:
      "Bring changing-star, planetary-system and early-galaxy research together in one connected view of the universe.",
  },
  jointPrograms: [
    {
      id: "changing-sky",
      name: "The changing sky",
      investmentId: "joint-changing-sky",
      creditsPerSecond: 1 / 60,
      publicationsPerSecond: 2 / 60,
      contributors: ["Ground photometry", "Radio timing"],
      description:
        "Connect repeated optical brightness measurements with radio timing to study changing sources.",
    },
    {
      id: "planetary-systems",
      name: "Worlds in context",
      investmentId: "joint-planetary-systems",
      creditsPerSecond: 2 / 60,
      publicationsPerSecond: 3 / 60,
      contributors: ["Orbital monitoring", "Stellar spectroscopy"],
      description:
        "Combine orbital brightness monitoring and stellar spectra to place planetary-system measurements in context.",
    },
    {
      id: "deep-time",
      name: "Light across time",
      investmentId: "joint-deep-time",
      creditsPerSecond: 3 / 60,
      publicationsPerSecond: 4 / 60,
      contributors: ["Mountain observatory", "Infrared flagship"],
      description:
        "Combine ground and infrared observing capability in a coordinated early-galaxy research program.",
    },
  ],
  missions: [
    {
      id: "orbital",
      name: "Orbital brightness monitoring",
      commissionId: "orbital-commissioning",
      publicationsPerSecond: 1 / 60,
      description: "The first optical orbital telescope repeatedly measures stellar brightness.",
    },
    {
      id: "infrared",
      name: "Infrared flagship survey",
      commissionId: "infrared-commissioning",
      publicationsPerSecond: 2 / 60,
      description: "A separate cooled observatory repeatedly surveys infrared fields.",
    },
  ],
  programs: [
    {
      id: "variable-star",
      name: "Variable-star photometry study",
      requires: ["photometry"],
      publicationsPerSecond: 1 / 60,
      description:
        "Independent research teams repeatedly study stellar brightness changes. Each team continuously generates Publications with no recurring costs.",
    },
  ],
  stations: [
    {
      id: "observatory",
      name: "Backyard observatory",
      subtitle: "01 · Gather the light",
      output: "Data",
      requires: [],
      reveal: [],
      use: "Telescopes add capacity. Research unlocks better targets. Every observation contributes to one Data balance.",
    },
    {
      id: "analysis",
      name: "Analysis lab",
      subtitle: "02 · Scientific understanding",
      output: "Knowledge",
      requires: ["analysis-tools"],
      reveal: ["observing-routine"],
      use: "Analyze Data for Knowledge now, or invest in permanent income. Knowledge unlocks scientific capabilities and new targets.",
    },
    {
      id: "outreach",
      name: "Outreach",
      subtitle: "03 · Share the sky",
      output: "Interest",
      requires: ["outreach"],
      reveal: ["analysis-tools"],
      use: "Generate community Interest to establish supporter groups and help open the academy.",
    },
    {
      id: "support",
      name: "Support office",
      subtitle: "04 · Build lasting support",
      output: "Funding",
      requires: ["support-office"],
      reveal: ["outreach"],
      use: "Funding buys telescopes, equipment, classrooms and research teams. Existing producers have no operating costs.",
    },
    {
      id: "engineering",
      name: "Engineering workshop",
      subtitle: "05 · Build the next instrument",
      output: "Engineering Progress",
      requires: ["engineering"],
      reveal: ["tracking"],
      use: "Benches and engineers create Engineering Progress. Spend it once on permanent facilities and instruments. No wages or operating costs.",
    },
    {
      id: "academy",
      name: "Academy",
      subtitle: "06 · Teach the next observer",
      output: "People",
      requires: ["academy"],
      reveal: ["target-star-clusters"],
      use: "Classrooms automatically graduate people every 40 seconds. Add qualified teaching teams for more independent classrooms.",
    },
    {
      id: "research",
      name: "Research institute",
      subtitle: "07 · Institutional expertise",
      output: "Expertise",
      requires: ["research"],
      reveal: ["first-graduate"],
      use: "Mentoring and researchers build Expertise for required calibration and operations methods, plus station improvements. Target research uses Knowledge in Analysis.",
    },
    {
      id: "science",
      name: "Scientific programs",
      subtitle: "08 · Publish a result",
      output: "Publications",
      requires: ["photometry"],
      reveal: ["research"],
      use: "Teams continuously generate Publications. Your unspent record qualifies the network for grants, missions and advanced research.",
    },
    {
      id: "radio",
      name: "Radio observatory",
      subtitle: "09 · Listen to the sky",
      output: "Data",
      requires: ["radio-observatory"],
      reveal: ["mountain-telescope", "target-galaxy-clusters"],
      use: "Radio dishes add another observing wavelength to the shared Data stream. More dishes increase permanent capacity; radio research improves science.",
    },
    {
      id: "space",
      name: "Space missions",
      subtitle: "10 · Beyond the atmosphere",
      output: "Data",
      requires: ["space-program"],
      reveal: ["target-radio-sources"],
      use: "Build and commission two distinct telescopes in stages. Each continuously produces Data and Publications. No operating costs; earlier instruments continue.",
    },
    {
      id: "joint",
      name: "Joint science",
      subtitle: "11 · Bring the network together",
      output: "Collaboration Credits",
      requires: ["joint-science"],
      reveal: ["orbital-commissioning"],
      use: "Add complementary research teams that continuously earn Collaboration Credits and Publications. Improve the network, then complete its final synthesis.",
    },
  ],
  facilities: [
    {
      id: null,
      name: "Backyard observatory",
      description: "The founding telescope and its growing collection of instruments.",
      telescopes: 0,
    },
    {
      id: "permanent-enclosure",
      name: "Permanent enclosure",
      description: "A dedicated home for the existing instruments. +4 base observing capacity.",
      telescopes: 0,
    },
    {
      id: "robotic-dome",
      name: "Robotic dome",
      description:
        "A new automated instrument joins the backyard network. +8 base capacity; enables a spectrograph.",
      telescopes: 1,
    },
    {
      id: "expanded-observatory",
      name: "Expanded observatory",
      description:
        "Two more instruments extend the network. +16 base capacity; enables galaxy imaging.",
      telescopes: 2,
    },
    {
      id: "mountain-telescope",
      name: "Mountain observatory",
      description:
        "A larger mountain telescope joins every earlier instrument. +32 base capacity; enables galaxy-cluster imaging.",
      telescopes: 1,
    },
    {
      id: "radio-observatory",
      name: "Radio observatory",
      description: "A radio dish joins the ground network. Optical instruments remain productive.",
      telescopes: 1,
    },
    {
      id: "orbital-commissioning",
      name: "Orbital observatory network",
      description: "The first optical telescope observes from orbit alongside the ground network.",
      telescopes: 1,
    },
    {
      id: "infrared-commissioning",
      name: "Infrared observatory network",
      description:
        "The cooled infrared flagship joins the first orbital telescope and all ground instruments.",
      telescopes: 1,
    },
  ],
  targets: [
    {
      id: "moon",
      name: "Moon",
      investmentId: null,
      yield: 1,
      claim: "Began lunar observations with the founding telescope.",
    },
    {
      id: "jupiter",
      name: "Jupiter",
      investmentId: "target-jupiter",
      yield: 2,
      claim: "Extended observing methods to Jupiter. Network Data yield is now ×2.",
    },
    {
      id: "saturn",
      name: "Saturn and its moons",
      investmentId: "target-saturn",
      yield: 3,
      claim: "Extended observing methods to Saturn and its moons. Network Data yield is now ×3.",
    },
    {
      id: "star-clusters",
      name: "Star clusters",
      investmentId: "target-star-clusters",
      yield: 5,
      claim: "Opened stellar-cluster imaging. Network Data yield is now ×5.",
    },
    {
      id: "nebulae",
      name: "Nebulae",
      investmentId: "target-nebulae",
      yield: 8,
      claim: "Extended imaging to nebulae. Network Data yield is now ×8.",
    },
    {
      id: "galaxies",
      name: "Galaxies",
      investmentId: "target-galaxies",
      yield: 13,
      claim: "Extended the expanded observatory to galaxy imaging. Network Data yield is now ×13.",
    },
    {
      id: "galaxy-clusters",
      name: "Galaxy clusters",
      investmentId: "target-galaxy-clusters",
      yield: 21,
      claim:
        "Opened galaxy-cluster imaging with the mountain observatory. Network Data yield is now ×21.",
    },
    {
      id: "radio-sources",
      name: "Radio sources",
      investmentId: "target-radio-sources",
      yield: 34,
      claim: "Opened radio-source research. Network Data yield is now ×34.",
    },
    {
      id: "transit-targets",
      name: "Transit targets",
      investmentId: "target-transit-targets",
      yield: 55,
      claim:
        "Extended orbital brightness monitoring to transit targets. Network Data yield is now ×55.",
    },
    {
      id: "infrared-fields",
      name: "Infrared fields",
      investmentId: "target-infrared-fields",
      yield: 89,
      claim:
        "Opened infrared-field research with the cooled flagship. Network Data yield is now ×89.",
    },
    {
      id: "deep-field",
      name: "Early-galaxy deep fields",
      investmentId: "target-deep-field",
      yield: 144,
      claim:
        "Extended the network to early-galaxy deep-field studies. Network Data yield is now ×144.",
    },
  ],
  actions: [
    {
      id: "listen-sky",
      name: "Observe the radio sky",
      station: "radio",
      requires: ["radio-observatory"],
      output: { D: 2 },
    },
    {
      id: "develop-instruments",
      name: "Develop instruments",
      station: "engineering",
      requires: ["engineering"],
      output: { E: 0.25 },
    },
    {
      id: "observe",
      name: "Observe the sky",
      station: "observatory",
      requires: [],
      output: { D: 1 },
    },
    {
      id: "share-sky",
      name: "Share the sky",
      station: "outreach",
      requires: ["outreach"],
      output: { I: 0.5 },
    },
    {
      id: "contact-supporters",
      name: "Contact supporters",
      station: "support",
      requires: ["support-office"],
      output: { F: 0.25 },
    },
    {
      id: "refine-practice",
      name: "Refine team practice",
      station: "research",
      requires: ["research"],
      output: { X: 0.01 },
    },
  ],
  investments: investments([
    {
      id: "advanced-calibration",
      name: "Develop advanced calibration",
      station: "research",

      requires: ["research", "camera"],
      publications: 5,
      cost: { K: 60, X: 8 },

      effect:
        "Qualify at 5 Publications. Expertise enables the spectrograph and mountain telescope.",
    },
    {
      id: "orbital-operations",
      name: "Develop orbital operations",
      station: "research",

      requires: ["space-program", "advanced-calibration"],
      publications: 30,
      cost: { K: 300, X: 25 },

      effect: "Qualify at 30 Publications. Expertise enables optical payload integration.",
    },
    {
      id: "infrared-calibration",
      name: "Develop infrared calibration",
      station: "research",

      requires: ["infrared-program", "advanced-calibration"],
      publications: 1000,
      cost: { K: 600, X: 45 },

      effect: "Qualify at 1,000 Publications. Expertise enables the flagship mirror and payload.",
    },
    {
      id: "network-integration",
      name: "Develop network integration",
      station: "research",

      requires: ["joint-science", "orbital-operations"],
      publications: 1000,
      cost: { K: 4000, X: 400 },

      effect: "Qualify at 1,000 Publications. Integrate the network for the final synthesis.",
    },
    {
      id: "advanced-grants",
      name: "Qualify for research grants",
      station: "support",

      requires: ["grant-office"],
      publications: 15,
      cost: { K: 80, X: 3 },

      effect: "A record of 15 Publications opens research grants: 4 base Funding/s each.",
    },
    {
      id: "research-grant",
      name: "Secure research grant",
      station: "support",
      kind: "producer",
      requires: ["advanced-grants"],
      cost: { F: 120, K: 30 },
      grant: true,
      growth: 1.8,
      maxLevel: 1000,
      output: { F: 4 },
      effect:
        "Use one shared Publication-backed grant slot for 4 base Funding/s. Publications are never spent.",
    },
    {
      id: "flagship-grants",
      name: "Qualify for flagship grants",
      station: "support",

      requires: ["advanced-grants"],
      publications: 100,
      cost: { K: 300, X: 10 },

      effect: "A record of 100 Publications opens flagship grants: 8 base Funding/s each.",
    },
    {
      id: "flagship-grant",
      name: "Secure flagship grant",
      station: "support",
      kind: "producer",
      requires: ["flagship-grants"],
      cost: { F: 600, K: 150 },
      grant: true,
      growth: 1.8,
      maxLevel: 1000,
      output: { F: 8 },
      effect:
        "Use one shared Publication-backed grant slot for 8 base Funding/s. Prices grow 80%; no upkeep.",
    },
    {
      id: "appoint-coordinator",
      name: "Appoint science coordinator",
      station: "joint",
      kind: "appointment",
      requires: ["joint-science"],
      cost: { N: 1, F: 100 },
      growth: 1.5,

      boost: { stat: "collaboration", bonus: 0.25 },
      effect: "Permanently appoint one graduate: +25% of base Collaboration Credit production.",
    },
    {
      id: "joint-science",
      name: "Open joint science center",
      station: "joint",

      requires: ["orbital-commissioning", "radio-observatory", "research"],
      publications: 400,
      cost: { E: 6000, F: 36000, K: 30000 },

      effect:
        "Connect the network through three complementary programs. Add permanent teams to increase continuous output.",
    },
    {
      id: "joint-changing-sky",
      name: "Add changing-sky team",
      station: "joint",
      kind: "appointment",
      requires: ["joint-science", "radio-timing", "photometry"],
      publications: 400,
      cost: { N: 1, D: 500000, F: 3000, K: 6000 },
      growth: 1.6,
      maxLevel: 50,

      effect:
        "Ground photometry + radio timing: Each team adds 0.017 base Collaboration Credits/s and 0.033 base Publications/s. Prices grow 60%.",
    },
    {
      id: "joint-planetary-systems",
      name: "Add planetary-systems team",
      station: "joint",
      kind: "appointment",
      requires: [
        "joint-science",
        "orbital-monitoring",
        "stellar-spectroscopy",
        "target-transit-targets",
      ],
      publications: 800,
      cost: { N: 1, D: 2e6, F: 10000, K: 18000 },
      growth: 1.6,
      maxLevel: 50,

      effect:
        "Orbital monitoring + stellar spectra: Each team adds 0.033 base Credits/s and 0.05 base Publications/s. Prices grow 60%.",
    },
    {
      id: "joint-deep-time",
      name: "Add deep-time team",
      station: "joint",
      kind: "appointment",
      requires: [
        "joint-science",
        "mountain-telescope",
        "infrared-commissioning",
        "target-deep-field",
      ],
      publications: 3000,
      cost: { N: 1, D: 1e7, F: 32000, K: 48000 },
      growth: 1.6,
      maxLevel: 50,

      effect:
        "Mountain + infrared observations: Each team adds 0.05 base Credits/s and 0.067 base Publications/s. Prices grow 60%.",
    },
    {
      id: "collaboration-practice",
      name: "Improve collaboration practice",
      station: "research",
      kind: "upgrade",
      requires: ["joint-science"],
      cost: { X: 3 },
      growth: 1.7,
      maxLevel: 8,

      boost: { stat: "collaboration", bonus: 0.5 },
      effect: "+50% of base Collaboration Credits per second.",
    },
    {
      id: "coordinated-observing",
      name: "Coordinate observing network",
      station: "joint",
      kind: "upgrade",
      requires: ["joint-science"],
      cost: { C: 4 },
      growth: 1.7,
      maxLevel: 8,

      boost: { stat: "observing", bonus: 0.5 },
      effect: "+50% of base Data output across the whole network, including observing assistance.",
    },
    {
      id: "shared-catalog",
      name: "Build shared analysis catalog",
      station: "joint",
      kind: "upgrade",
      requires: ["joint-science"],
      cost: { C: 3 },
      growth: 1.7,
      maxLevel: 8,

      boost: { stat: "analysis", bonus: 1 },
      effect: "+100% of base Knowledge income and instant Knowledge per Data.",
    },
    {
      id: "shared-instrumentation",
      name: "Share instrument development",
      station: "joint",
      kind: "upgrade",
      requires: ["joint-science"],
      cost: { C: 4 },
      growth: 1.7,
      maxLevel: 8,

      boost: { stat: "engineering", bonus: 0.5 },
      effect: "+50% of base Engineering income and active development yield.",
    },
    {
      id: "shared-science",
      name: "Coordinate scientific analysis",
      station: "joint",
      kind: "upgrade",
      requires: ["joint-science"],
      cost: { C: 4 },
      growth: 1.7,
      maxLevel: 8,

      boost: { stat: "science", bonus: 0.5 },
      effect:
        "+50% of base Publication production across ground teams, space missions and joint programs. Production is continuous.",
    },
    {
      id: "network-synthesis",
      name: "Complete final network synthesis",
      station: "joint",

      requires: [
        "joint-changing-sky",
        "joint-planetary-systems",
        "joint-deep-time",
        "network-integration",
      ],
      publications: 5000,
      cost: { D: 100000000, F: 1000000, K: 100000, E: 100000, C: 500 },

      effect:
        "Combine all three programs, network integration and 5,000 Publications. Pay the resources to complete the prototype immediately.",
    },
    {
      id: "radio-observatory",
      name: "Build radio observatory",
      station: "radio",
      kind: "producer",
      requires: ["mountain-telescope", "target-galaxy-clusters"],
      publications: 100,
      cost: { E: 12000, F: 64000, K: 12000 },

      output: { D: 24 },
      effect:
        "Add the first radio dish and 24 base Data capacity. A new observing wavelength; all optical instruments continue.",
    },
    {
      id: "radio-dish",
      name: "Add radio dish",
      station: "radio",
      kind: "producer",
      requires: ["radio-observatory"],
      cost: { E: 8000, F: 40000, K: 9000 },
      growth: 1.6,
      maxLevel: 50,
      output: { D: 12 },
      effect:
        "Add 12 base Data capacity per dish. Prices grow 60%; no upkeep or telescope reassignment.",
    },
    {
      id: "radio-timing",
      name: "Develop radio timing",
      station: "science",
      kind: "upgrade",
      requires: ["radio-observatory", "photometry"],
      cost: { K: 160, X: 3 },

      boost: { stat: "science", bonus: 0.5 },
      effect: "Add radio timing measurements: +50% of base Publication production per second.",
    },
    {
      id: "target-radio-sources",
      name: "Research radio sources",
      station: "analysis",
      kind: "discovery",
      requires: ["radio-observatory", "target-galaxy-clusters"],
      cost: { K: 250 },

      effect:
        "Extend the network frontier from ×21 to ×34. Radio opens another way to observe the sky.",
    },
    {
      id: "space-program",
      name: "Establish space program",
      station: "space",

      requires: ["target-radio-sources"],
      publications: 200,
      cost: { E: 16000, F: 96000, K: 24000 },

      effect:
        "Open staged construction of the first optical orbital telescope. Existing observatories keep working.",
    },
    {
      id: "orbital-platform",
      name: "Build orbital platform",
      station: "space",

      requires: ["space-program"],
      cost: { E: 30000, F: 200000, K: 45000 },

      effect:
        "Complete the first spacecraft platform. Install its optical payload next; observing starts after commissioning.",
    },
    {
      id: "orbital-payload",
      name: "Install optical payload",
      station: "space",

      requires: ["orbital-operations", "orbital-platform"],
      cost: { E: 60000, F: 360000, K: 90000 },

      effect:
        "Complete the optical instrument. Launch and commission the telescope to begin automatic observing.",
    },
    {
      id: "orbital-commissioning",
      name: "Launch and commission orbital telescope",
      station: "space",
      kind: "producer",
      requires: ["orbital-payload"],
      publications: 400,
      cost: { E: 24000, F: 144000, K: 36000 },

      output: { D: 48 },
      effect:
        "Add 48 base Data capacity. Start continuous orbital science at 0.017 base Publications/s.",
    },
    {
      id: "orbital-monitoring",
      name: "Develop orbital monitoring",
      station: "science",
      kind: "upgrade",
      requires: ["orbital-commissioning", "photometry"],
      cost: { K: 200, X: 5 },

      boost: { stat: "science", bonus: 0.5 },
      effect:
        "Add sustained orbital brightness measurements: +50% of base Publication production per second.",
    },
    {
      id: "target-transit-targets",
      name: "Research transit targets",
      station: "analysis",
      kind: "discovery",
      requires: ["orbital-commissioning", "target-radio-sources"],
      cost: { K: 400 },

      effect:
        "Extend the frontier from ×34 to ×55 through brightness monitoring of transit targets. No claim of life detection.",
    },
    {
      id: "infrared-program",
      name: "Establish infrared flagship program",
      station: "space",

      requires: ["orbital-commissioning", "target-transit-targets"],
      publications: 1000,
      cost: { E: 72000, F: 0.48e6, K: 54000 },

      effect:
        "Begin a separate infrared mission at 1,000 Publications. The first mission continues.",
    },
    {
      id: "infrared-mirror",
      name: "Build flagship mirror and payload",
      station: "space",

      requires: ["infrared-calibration", "infrared-program"],
      cost: { E: 192000, F: 1.28e6, K: 144000 },

      effect: "Assemble the infrared instrument. Complete thermal shielding before commissioning.",
    },
    {
      id: "infrared-shield",
      name: "Install flagship thermal shield",
      station: "space",

      requires: ["infrared-mirror"],
      cost: { E: 200000, F: 1.2e6, K: 150000 },

      effect:
        "Complete thermal shielding for the cooled infrared observatory. Commission the distinct flagship next.",
    },
    {
      id: "infrared-commissioning",
      name: "Launch and commission infrared flagship",
      station: "space",
      kind: "producer",
      requires: ["infrared-shield"],
      publications: 2000,
      cost: { E: 120000, F: 0.8e6, K: 90000 },

      output: { D: 96 },
      effect:
        "Add 96 base Data capacity and continuous science at 0.033 base Publications/s. Earlier missions continue.",
    },
    {
      id: "target-infrared-fields",
      name: "Research infrared fields",
      station: "analysis",
      kind: "discovery",
      requires: ["infrared-commissioning", "target-transit-targets"],
      cost: { K: 800 },

      effect: "Extend the frontier from ×55 to ×89 with infrared observing capability.",
    },
    {
      id: "target-deep-field",
      name: "Research early-galaxy deep fields",
      station: "analysis",
      kind: "discovery",
      requires: ["infrared-commissioning", "target-infrared-fields"],
      publications: 3000,
      cost: { K: 1200 },

      effect:
        "Extend the frontier from ×89 to ×144 at 3,000 Publications. Study early galaxies; the Big Bang is not directly imaged.",
    },
    {
      id: "engineering",
      name: "Open engineering workshop",
      station: "engineering",
      kind: "producer",
      requires: ["tracking", "support-office"],
      cost: { F: 30, K: 15 },

      output: { E: 0.15 },
      effect:
        "Establish the founding bench: +0.15 base Engineering Progress/s. No operating costs.",
    },
    {
      id: "engineering-bench",
      name: "Add engineering bench",
      station: "engineering",
      kind: "producer",
      requires: ["engineering"],
      cost: { F: 60, K: 20 },
      growth: 1.5,
      maxLevel: 50,
      output: { E: 0.25 },
      effect: "Add 0.25 base Engineering Progress/s permanently. Prices grow 50% per bench.",
    },
    {
      id: "appoint-engineer",
      name: "Appoint engineer",
      station: "engineering",
      kind: "appointment",
      requires: ["engineering", "academy"],
      cost: { N: 1, F: 40 },
      growth: 1.5,

      output: { E: 0.5 },
      effect:
        "One permanent graduate adds 0.5 base Engineering Progress/s. Funding price grows 50%; no wages.",
    },
    {
      id: "engineering-methods",
      name: "Improve engineering practice",
      station: "research",
      kind: "upgrade",
      requires: ["engineering"],
      cost: { X: 1 },
      growth: 1.7,
      maxLevel: 8,

      boost: { stat: "engineering", bonus: 0.5 },
      effect: "+50% of base Engineering Progress income and instrument-development assistance.",
    },
    {
      id: "permanent-enclosure",
      name: "Build permanent enclosure",
      station: "observatory",
      kind: "producer",
      requires: ["engineering", "reflector"],
      cost: { E: 30, F: 180, K: 45 },

      output: { D: 4 },
      effect:
        "Add 4 base observing capacity with permanent housing for the instruments. All earlier production continues.",
    },
    {
      id: "robotic-dome",
      name: "Build robotic dome",
      station: "observatory",
      kind: "producer",
      requires: ["permanent-enclosure", "research"],
      cost: { E: 240, F: 960, K: 240 },

      output: { D: 8 },
      effect:
        "Add an automated telescope and 8 base observing capacity. Enables spectrograph development.",
    },
    {
      id: "expanded-observatory",
      name: "Expand observatory network",
      station: "observatory",
      kind: "producer",
      requires: ["robotic-dome", "target-nebulae", "first-publication"],
      cost: { E: 1280, F: 5120, K: 1280 },

      output: { D: 16 },
      effect:
        "Add two instruments and 16 base observing capacity. Enables galaxy imaging research.",
    },
    {
      id: "mountain-telescope",
      name: "Build mountain telescope",
      station: "observatory",
      kind: "producer",
      requires: ["advanced-calibration", "expanded-observatory", "target-galaxies"],
      publications: 30,
      cost: { E: 2880, F: 19200, K: 3840 },

      output: { D: 32 },
      effect:
        "Add a mountain instrument and 32 base observing capacity. Enables galaxy-cluster imaging; all earlier telescopes remain.",
    },
    {
      id: "spectrograph",
      name: "Develop spectrograph",
      station: "engineering",

      requires: ["advanced-calibration", "robotic-dome"],
      cost: { E: 20, K: 40 },

      effect:
        "Add the instrument capability needed for stellar spectroscopy in Scientific programs.",
    },
    {
      id: "stellar-spectroscopy",
      name: "Develop stellar spectroscopy",
      station: "science",
      kind: "upgrade",
      requires: ["spectrograph", "photometry"],
      cost: { K: 40 },

      boost: { stat: "science", bonus: 1 },
      effect:
        "Add spectral measurements to brightness studies: +100% of base Publications per second.",
    },
    {
      id: "target-galaxies",
      name: "Research galaxy imaging",
      station: "analysis",
      kind: "discovery",
      requires: ["target-nebulae", "expanded-observatory"],
      cost: { K: 150 },

      effect: "Extend the observing frontier from ×8 to ×13. Every retained producer benefits.",
    },
    {
      id: "target-galaxy-clusters",
      name: "Research galaxy-cluster imaging",
      station: "analysis",
      kind: "discovery",
      requires: ["target-galaxies", "mountain-telescope"],
      cost: { K: 300 },

      effect:
        "Extend the observing frontier from ×13 to ×21. Completes the ground-observatory prototype frontier.",
    },
    {
      id: "photometry",
      name: "Develop photometry",
      station: "science",

      requires: ["research", "camera"],
      cost: { D: 2000, K: 120, F: 60 },

      effect: "Establish the founding research team: 0.017 base Publications/s, continuously.",
    },
    {
      id: "grant-office",
      name: "Open grant office",
      station: "support",

      requires: ["first-publication"],
      cost: { F: 150, K: 30 },

      effect:
        "Unlock grant purchases. Each Publication supports one grant; Publications are never spent.",
    },
    {
      id: "observing-grant",
      name: "Secure observing grant",
      station: "support",
      kind: "producer",
      requires: ["grant-office"],
      cost: { F: 20, K: 5 },
      grant: true,
      growth: 1.4,
      maxLevel: 50,
      output: { F: 2 },
      effect:
        "Add recurring Funding with no upkeep. Uses one Publication-backed grant slot for this run.",
    },
    {
      id: "appoint-scientist",
      name: "Establish research team",
      station: "science",
      kind: "appointment",
      requires: ["photometry", "academy"],
      cost: { N: 1, D: 500, K: 20, F: 30 },
      growth: 1.6,

      effect:
        "One graduate establishes another team producing 0.017 base Publications/s. Stock prices grow 60% per team; no upkeep.",
    },
    {
      id: "science-practice",
      name: "Improve scientific practice",
      station: "research",
      kind: "upgrade",
      requires: ["photometry"],
      cost: { X: 0.5 },
      growth: 1.7,
      maxLevel: 8,

      boost: { stat: "science", bonus: 0.5 },
      effect: "+50% of base Publications per second.",
    },
    {
      id: "observing-routine",
      name: "Establish observing routine",
      station: "observatory",
      kind: "producer",
      requires: [],
      cost: { D: 5 },

      output: { D: 1 },
      effect: "Automates the founding telescope: +1 base observing capacity.",
    },
    {
      id: "analysis-tools",
      name: "Open basic analysis",
      station: "analysis",

      requires: ["observing-routine"],
      cost: { D: 10 },

      effect: "Unlock instant analysis, archive research and target discoveries.",
    },
    {
      id: "archive-research",
      name: "Expand archive research",
      station: "analysis",
      kind: "producer",
      requires: ["analysis-tools"],
      cost: { D: 25 },
      growth: 1.4,
      maxLevel: 50,
      output: { K: 0.2 },
      effect: "Permanent Knowledge income. Pay Data once; no continuing Data drain.",
    },
    {
      id: "target-jupiter",
      name: "Research Jupiter observations",
      station: "analysis",
      kind: "discovery",
      requires: ["analysis-tools"],
      cost: { K: 8 },

      effect:
        "Raise the observing frontier from ×1 to ×2. All installed capacity and active observing benefit.",
    },
    {
      id: "outreach",
      name: "Open outreach",
      station: "outreach",

      requires: ["analysis-tools"],
      cost: { K: 5 },

      effect: "Unlock sharing the sky and standing outreach activities.",
    },
    {
      id: "outreach-activity",
      name: "Add outreach activity",
      station: "outreach",
      kind: "producer",
      requires: ["outreach"],
      cost: { K: 2 },
      growth: 1.3,
      maxLevel: 50,
      output: { I: 0.2 },
      effect: "Permanent Interest income. Other stations keep their full production.",
    },
    {
      id: "support-office",
      name: "Open support office",
      station: "support",

      requires: ["outreach"],
      cost: { K: 2, I: 5 },

      effect: "Unlock supporter groups and Funding actions.",
    },
    {
      id: "supporter-group",
      name: "Add supporter group",
      station: "support",
      kind: "producer",
      requires: ["support-office"],
      cost: { I: 10 },
      growth: 1.25,
      maxLevel: 50,
      output: { F: 0.4 },
      effect: "Permanent Funding income. Spending Interest never removes existing supporters.",
    },
    {
      id: "additional-telescope",
      name: "Add observing telescope",
      station: "observatory",
      kind: "producer",
      requires: ["support-office"],
      cost: { F: 15, K: 2 },
      growth: 1.4,
      maxLevel: 50,
      output: { D: 2 },
      effect: "Add 2 base observing capacity. Every target and equipment bonus applies.",
    },
    {
      id: "stable-mount",
      name: "Install stable mount",
      station: "observatory",
      kind: "upgrade",
      requires: ["support-office"],
      cost: { F: 10, K: 3 },

      boost: { stat: "observing", bonus: 0.25 },
      effect: "+25% of base observing output, including active help.",
    },
    {
      id: "tracking",
      name: "Install motorized tracking",
      station: "observatory",

      requires: ["stable-mount", "target-jupiter"],
      cost: { F: 25, K: 5 },

      effect: "Open tracked observing methods and the reflector path.",
    },
    {
      id: "target-saturn",
      name: "Research Saturn observations",
      station: "analysis",
      kind: "discovery",
      requires: ["target-jupiter", "tracking"],
      cost: { K: 20 },

      effect: "Raise the observing frontier from ×2 to ×3, permanently.",
    },
    {
      id: "reflector",
      name: "Build 150–200 mm reflector",
      station: "observatory",
      kind: "producer",
      requires: ["tracking"],
      cost: { F: 180, K: 30 },

      output: { D: 4 },
      effect:
        "Add 4 base observing capacity and enable camera equipment. All earlier telescopes remain productive.",
    },
    {
      id: "camera",
      name: "Install imaging camera",
      station: "observatory",
      kind: "upgrade",
      requires: ["reflector"],
      cost: { F: 160, K: 32 },

      boost: { stat: "observing", bonus: 0.5 },
      effect: "+50% of base observing output; enables imaging research.",
    },
    {
      id: "target-star-clusters",
      name: "Research stellar-cluster imaging",
      station: "analysis",
      kind: "discovery",
      requires: ["target-saturn", "camera"],
      cost: { K: 35 },

      effect: "Raise the observing frontier from ×3 to ×5 and reveal the academy.",
    },
    {
      id: "target-nebulae",
      name: "Research nebula imaging",
      station: "analysis",
      kind: "discovery",
      requires: ["target-star-clusters"],
      cost: { K: 400 },

      effect:
        "Raise Data yield from ×5 to ×8; enables observatory expansion and prestige eligibility.",
    },
    {
      id: "workstation",
      name: "Install analysis workstation",
      station: "analysis",
      kind: "upgrade",
      requires: ["camera"],
      cost: { F: 90, K: 15 },

      boost: { stat: "analysis", bonus: 1 },
      effect: "+100% of base Knowledge income and instant analysis yield.",
    },
    {
      id: "outreach-materials",
      name: "Improve outreach materials",
      station: "outreach",
      kind: "upgrade",
      requires: ["support-office"],
      cost: { F: 10, K: 3 },
      growth: 1.6,
      maxLevel: 5,

      boost: { stat: "outreach", bonus: 0.5 },
      effect: "+50% of base passive Interest and Share the sky yield per level.",
    },
    {
      id: "supporter-appeals",
      name: "Improve supporter appeals",
      station: "support",
      kind: "upgrade",
      requires: ["support-office"],
      cost: { K: 5 },
      growth: 1.6,
      maxLevel: 5,

      boost: { stat: "support", bonus: 0.5 },
      effect: "+50% of base Funding income and Contact supporters yield per level.",
    },
    {
      id: "academy",
      name: "Open academy",
      station: "academy",

      requires: ["target-star-clusters"],
      cost: { F: 320, K: 60, I: 16 },

      effect:
        "Establish the founding classroom: one base graduate every 40 seconds, automatically.",
    },
    {
      id: "research",
      name: "Establish research institute",
      station: "research",
      kind: "producer",
      requires: ["first-graduate"],
      cost: { F: 90, K: 30 },

      output: { X: 0.02 },
      effect:
        "The first mentoring program generates Expertise for advanced methods and station improvements.",
    },
    {
      id: "mentoring-program",
      name: "Add mentoring program",
      station: "research",
      kind: "producer",
      requires: ["research"],
      cost: { F: 30, K: 10 },
      growth: 1.4,
      maxLevel: 50,
      output: { X: 0.02 },
      effect: "Permanent Expertise income. No recurring costs or staff transfers.",
    },
    {
      id: "teaching-qualification",
      name: "Develop teaching qualification",
      station: "academy",

      requires: ["research"],
      cost: { K: 5, X: 0.5 },

      effect: "Unassigned graduates can become permanent teachers.",
    },
    {
      id: "operations-methods",
      name: "Improve observing practice",
      station: "research",
      kind: "upgrade",
      requires: ["research"],
      cost: { X: 0.5 },
      growth: 1.7,
      maxLevel: 8,

      boost: { stat: "observing", bonus: 0.25 },
      effect: "+25% of base Data output, including active help.",
    },
    {
      id: "analysis-methods",
      name: "Improve analysis practice",
      station: "research",
      kind: "upgrade",
      requires: ["research"],
      cost: { X: 0.5 },
      growth: 1.7,
      maxLevel: 8,

      boost: { stat: "analysis", bonus: 0.5 },
      effect: "+50% of base Knowledge income and instant analysis yield.",
    },
    {
      id: "teaching-methods",
      name: "Improve teaching practice",
      station: "research",
      kind: "upgrade",
      requires: ["research"],
      cost: { X: 0.5 },
      growth: 1.7,
      maxLevel: 8,

      boost: { stat: "teaching", bonus: 0.25 },
      effect: "+25% of base graduates per completed cycle. Timers stay at 40 seconds.",
    },
    {
      id: "appoint-observer",
      name: "Appoint observer",
      station: "observatory",
      kind: "appointment",
      requires: ["academy"],
      cost: { N: 1 },

      output: { D: 2 },
      effect:
        "Permanent appointment: add 2 observing capacity across the current and all future frontiers.",
    },
    {
      id: "appoint-analyst",
      name: "Appoint analyst",
      station: "analysis",
      kind: "appointment",
      requires: ["academy"],
      cost: { N: 1 },

      output: { K: 0.5 },
      effect: "Permanent appointment: add Knowledge production. No Data drain.",
    },
    {
      id: "appoint-educator",
      name: "Appoint educator",
      station: "outreach",
      kind: "appointment",
      requires: ["academy", "outreach"],
      cost: { N: 1 },

      output: { I: 0.5 },
      effect: "Permanent appointment: add Interest production for supporter groups.",
    },
    {
      id: "appoint-fundraiser",
      name: "Appoint fundraiser",
      station: "support",
      kind: "appointment",
      requires: ["academy", "support-office"],
      cost: { N: 1 },

      output: { F: 1 },
      effect: "Permanent appointment: add Funding production. No wages.",
    },
    {
      id: "appoint-teacher",
      name: "Establish teaching team",
      station: "academy",
      kind: "appointment",
      requires: ["teaching-qualification"],
      cost: { N: 1, F: 30, K: 10 },
      growth: 3,

      effect:
        "One qualified graduate establishes another independent 40-second classroom. Stock prices triple per team; no upkeep.",
    },
    {
      id: "appoint-researcher",
      name: "Appoint researcher",
      station: "research",
      kind: "appointment",
      requires: ["academy", "research"],
      cost: { N: 1 },

      output: { X: 0.04 },
      effect: "Permanent appointment: add institutional Expertise production.",
    },
  ]),
};
