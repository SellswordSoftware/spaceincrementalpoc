import { createGame, TICK_SECONDS } from '../src/core/index.js';
import { runStationScenario } from './stations.js';
import { runEngineeringScenario } from './engineering.js';
import { runHorizonsScenario } from './horizons.js';
import { runSynthesisScenario } from './synthesis.js';
import { runPrestigeScenario } from './prestige.js';

/** Finish the same ordinary-command route from a basic network.
 * @param {ReturnType<typeof runStationScenario>} opening */
function finish(opening) {
  const engineering=runEngineeringScenario(opening.game);
  const horizons=runHorizonsScenario(engineering.game);
  const synthesis=runSynthesisScenario(horizons.game);
  const milestones={...opening.report.milestones};
  for (const report of [engineering.report,horizons.report,synthesis.report]) for (const [id,time] of Object.entries(report.milestones)) milestones[id]=Math.min(milestones[id]??Infinity,time);
  return {game:synthesis.game,report:{completionSeconds:(synthesis.game.state.joint.completedAtTick??0)*TICK_SECONDS,
    milestones,
    people:synthesis.game.state.population.total,classrooms:synthesis.game.state.academy.timers.length,
    insightEarned:synthesis.game.state.insight.totalEarned}};
}

/** Full completion in the initial run: no prestige, state edits or seeded resources. */
export function runContinuousProgression() { return finish(runStationScenario(createGame())); }

export function runProgressionComparison() {
  const continuous=runContinuousProgression();
  const prestige=runPrestigeScenario();
  // Reuse the same opening policy, then the same expansion policy on run two.
  const rebuilt=finish({game:prestige.game,report:prestige.secondReport});
  return {continuous,rebuilt,report:{firstRunCompletionSeconds:continuous.report.completionSeconds,
    rebuiltCompletionSeconds:rebuilt.report.completionSeconds,firstNetworkBeforeResetSeconds:prestige.report.firstRunSeconds,
    totalWithOneResetSeconds:prestige.report.firstRunSeconds+10+rebuilt.report.completionSeconds,
    firstRunMilestones:continuous.report.milestones,rebuiltMilestones:rebuilt.report.milestones,
    firstRunInsight:continuous.report.insightEarned,firstRunPeople:continuous.report.people,firstRunClassrooms:continuous.report.classrooms,
    rebuiltPeople:rebuilt.report.people,rebuiltClassrooms:rebuilt.report.classrooms}};
}
if (import.meta.main) console.log(JSON.stringify(runProgressionComparison().report,null,2));
