import { advanceTicks, balance, definitions, dispatch, previewPrestige, serializeGame, deserializeGame, TICK_SECONDS } from '../src/core/index.js';
import { runStationScenario } from './stations.js';

/** One full reset and the same policy rebuilding the entire P6 network. */
export function runPrestigeScenario() {
  const {game:initialGame,report:first}=runStationScenario();
  let game=initialGame;
  const firstRunSeconds=game.state.clock.tick*TICK_SECONDS;
  // In-flight timers make the preview/reset boundary observable.
  /** @param {import('../src/core/types.js').Command} command */
  function send(command) {
    const result=dispatch(game,definitions,balance,command);
    if (!result.ok) throw new Error(result.blockedReasons.join('; '));
  }
  advanceTicks(game,definitions,balance,40);
  const preview=previewPrestige(game,definitions,balance);
  send({type:'beginPrestige'});
  const reset=structuredClone(game.state);
  send({type:'buyInsightUpgrade',upgradeId:'expansive-observing'});
  send({type:'buyInsightUpgrade',upgradeId:'shared-enthusiasm'});
  send({type:'buyInsightUpgrade',upgradeId:'connected-thinking'});
  // Reload the shop before beginning: points must not be awarded again.
  const restored=deserializeGame(serializeGame(game));
  const shopRestored=serializeGame(restored)===serializeGame(game);
  game=restored;
  send({type:'startNextRun'});
  const {report:second}=runStationScenario(game);
  return {game,reset,preview,firstReport:first,secondReport:second,report:{award:preview.award,shopRestored,firstRunSeconds,
    secondRunSeconds:game.state.clock.tick*TICK_SECONDS,firstAcademySeconds:first.milestones.academy,
    secondAcademySeconds:second.milestones.academy,run:game.state.clock.campaignIndex,insight:game.state.insight,
    secondRunData:second.rates.D,secondRunFunding:second.rates.F}};
}
if (import.meta.main) console.log(JSON.stringify(runPrestigeScenario().report,null,2));
