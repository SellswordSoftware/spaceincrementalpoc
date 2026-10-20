import { progression } from "../definitions/progression.ts";
import type { GameState as Game } from "./types.ts";
import { TICK_SECONDS } from "./versions.ts";
import type { Economy } from "./economy.ts";
import type { Simulation } from "./simulation.ts";
import { catalog } from "../definitions/catalog.ts";
export function createSummary(economy: Economy, simulation: Simulation) {
  const { previewPrestige, quoteCommand } = simulation;
  const {
    definitions,
    balance,
    hasPrerequisite,
    multiplier,
    observingFrontier,
    baseProduction,
    productionRates,
    facilitySummary,
    newOptions,
    grantCount,
    populationSummary,
  } = economy;
  const data = catalog(definitions);
  function getGuidance(game: Game) {
    if (game.state.insight.phase === "shop")
      return {
        nextId: null,
        objective: `Spend Insight, then begin run ${game.state.clock.campaignIndex}.`,
        suggestion:
          "Permanent modifiers carry into every future run. Unspent points can be saved for your next prestige.",
      };
    const nextId = previewPrestige(game).encouraged
      ? "expanded-observatory"
      : progression.find((id) => !hasPrerequisite(game, id));
    const next = nextId ? data.investments.get(nextId) : undefined;
    const objective =
      game.state.joint.completedAtTick !== null
        ? "Eyes on the Universe complete. Keep observing, or prestige to rebuild with Insight."
        : nextId === "first-publication"
          ? "Build your first Publication through continuous research. Publications qualify the network for grants and advanced capabilities."
          : nextId === "first-graduate"
            ? "The founding classroom graduates automatically after 40 seconds. The first graduate reveals Research."
            : next
              ? `${next.name}. ${next.effect}`
              : "The connected network is ready for its final synthesis.";
    let suggestion =
      "Hold Observe for extra Data. Purchased production continues when you help elsewhere.";
    if (hasPrerequisite(game, "analysis-tools"))
      suggestion =
        "Analyze Data for an instant Knowledge boost. More distant observations need more processing per Data; archives and analysts provide steady Knowledge without consuming Data.";
    if (next?.cost.F)
      suggestion =
        "Supporter groups and extra telescopes are optional growth investments. Contact supporters can also help fund the next unlock.";
    if (next?.cost.E)
      suggestion =
        "Add engineering benches or permanently appoint engineers to build Engineering Progress. Existing stations keep producing.";
    if (!nextId)
      suggestion = hasPrerequisite(game, "target-nebulae")
        ? "Expand whichever station limits your next investment. Every appointment is permanent."
        : "Optional discovery: research nebula imaging to raise network Data yield to ×8.";
    const people = populationSummary(game);
    if (people.available > 0 && !next?.cost.E)
      suggestion = `${people.available} unassigned graduate${people.available === 1 ? "" : "s"} can join any eligible station. No particular appointment is required to progress.`;
    if (next?.cost.X)
      suggestion =
        "Add mentoring or appoint researchers to increase Expertise production for this required method.";
    if ((next?.publications ?? 0) > game.state.science.publications)
      suggestion = `Requires ${next?.publications} cumulative Publications; your record is never spent. Add research teams, improve scientific practice or coordinate science to increase production.`;
    return { nextId: nextId ?? null, objective, suggestion };
  }
  function getSummary(game: Game) {
    const rates = productionRates(game);
    const branches = Object.fromEntries(
      ["radio", "space"].map((station) => {
        const capacity = definitions.investments
          .filter((item) => item.station === station)
          .reduce(
            (sum, item) => sum + (item.output.D ?? 0) * (game.state.purchases[item.id] ?? 0),
            0,
          );
        return [
          station,
          {
            capacity,
            rate: capacity * observingFrontier(game).yield * multiplier(game, "observing"),
          },
        ];
      }),
    );
    return {
      newOptions: newOptions(game),
      readyOptions: economy
        .availableInvestments(game)
        .filter((item) => quoteCommand(game, { type: "buyInvestment", investmentId: item.id }).ok),
      joint: {
        ...game.state.joint,
        programs: definitions.jointPrograms.map((program) => {
          const teams = game.state.purchases[program.investmentId] ?? 0;
          return {
            ...program,
            teams,
            creditRate: program.creditsPerSecond * teams * multiplier(game, "collaboration"),
            publicationRate: program.publicationsPerSecond * teams * multiplier(game, "science"),
          };
        }),
        finale: definitions.finale,
      },
      branches,
      missions: definitions.missions.map((mission) => ({
        ...mission,
        commissioned: hasPrerequisite(game, mission.commissionId),
        rate: hasPrerequisite(game, mission.commissionId)
          ? mission.publicationsPerSecond * multiplier(game, "science")
          : 0,
      })),
      prestige: previewPrestige(game),
      science: {
        ...game.state.science,
        teams: hasPrerequisite(game, "photometry")
          ? 1 + (game.state.purchases["appoint-scientist"] ?? 0)
          : 0,
        rate: rates.science ?? 0,
      },
      academy: {
        ...game.state.academy,
        seconds: balance.course.seconds,
        reward: multiplier(game, "teaching"),
      },
      grants: {
        active: grantCount(game),
        capacity: Math.floor(game.state.science.publications + 1e-9),
      },
      seconds: game.state.clock.tick * TICK_SECONDS,
      rates,
      population: populationSummary(game),
      frontier: observingFrontier(game),
      observing: {
        ...facilitySummary(game),
        capacity: baseProduction(game).D ?? 0,
        bonus: multiplier(game, "observing"),
      },
      guidance: getGuidance(game),
      stations: definitions.stations.map((station) => ({
        ...station,
        visible: station.reveal.every((id) => hasPrerequisite(game, id)),
        open: station.requires.every((id) => hasPrerequisite(game, id)),
      })),
    };
  }
  return { getGuidance, getSummary };
}
