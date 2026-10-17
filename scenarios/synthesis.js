import { advanceTicks, balance, definitions, dispatch, getSummary, quoteCommand, serializeGame, deserializeGame, TICK_SECONDS } from '../src/core/index.js';
import { analysisYield } from '../src/core/rates.js';
import { runHorizonsScenario } from './horizons.js';
import { runEngineeringScenario } from './engineering.js';
import { runPrestigeScenario } from './prestige.js';

/** Continue the connected observatories through collaboration and the finite ending.
 * @param {import('../src/core/types.js').GameState} initial */
export function runSynthesisScenario(initial) {
  let game=initial;
  const started=game.state.clock.tick;
  /** @type {Record<string,number>} */
  const milestones={};
  /** @param {string} investmentId */
  function buy(investmentId) {
    const command=/** @type {const} */({type:'buyInvestment',investmentId});
    const deadline=game.state.clock.tick+24000;
    let quote=quoteCommand(game,definitions,balance,command);
    while (!quote.ok) {
      if (game.state.clock.tick>=deadline) throw new Error(`Synthesis progression stalled at ${investmentId}`);
      const needed=Math.max(0,(quote.costs.K??0)-game.state.resources.K);
      const quantity=Math.min(Math.max(0,game.state.resources.D-(quote.costs.D??0)),needed/analysisYield(game,definitions,balance));
      if (quantity>1e-9) dispatch(game,definitions,balance,{type:'processData',quantity});
      advanceTicks(game,definitions,balance,1);
      quote=quoteCommand(game,definitions,balance,command);
    }
    const result=dispatch(game,definitions,balance,command);
    if (!result.ok) throw new Error(result.blockedReasons.join('; '));
    milestones[investmentId]=game.state.clock.tick*TICK_SECONDS;
  }
  buy('joint-science'); buy('collaboration-practice');
  buy('joint-changing-sky');
  const firstAtEstablishment=structuredClone(game.state.joint.programs['changing-sky']);
  const creditsAtEstablishment=game.state.resources.C;
  advanceTicks(game,definitions,balance,40);
  const creditsBeforeFirstCycle=game.state.resources.C;
  buy('joint-planetary-systems'); buy('joint-deep-time');
  const beforeUpgrades=getSummary(game,definitions,balance).rates;
  for (const investmentId of ['coordinated-observing','shared-catalog','shared-instrumentation','shared-science']) buy(investmentId);
  const afterUpgrades=getSummary(game,definitions,balance).rates;
  const programCycles=Object.fromEntries(Object.entries(game.state.joint.programs).map(([id,state])=>[id,state.cycles]));
  buy('network-synthesis');
  const finaleAtStart=game.state.joint.finaleProgress;
  advanceTicks(game,definitions,balance,120); // Save after 30 of 90 seconds.
  const checkpoint=serializeGame(game);
  const restored=deserializeGame(checkpoint);
  const resumed=serializeGame(restored)===checkpoint;
  game=restored;
  advanceTicks(game,definitions,balance,239);
  const completedBeforeBoundary=game.state.joint.completedAtTick!==null;
  const finalTick=advanceTicks(game,definitions,balance,1);
  const completedAtTick=game.state.joint.completedAtTick;
  const afterCompletion=getSummary(game,definitions,balance);
  const repeated=advanceTicks(game,definitions,balance,240);
  return {game,report:{milestones,elapsedSeconds:(game.state.clock.tick-started)*TICK_SECONDS,
    creditsAtEstablishment,creditsBeforeFirstCycle,firstAtEstablishment,programCycles,
    beforeUpgrades,afterUpgrades,finaleAtStart,resumed,completedBeforeBoundary,completedAtTick,
    completionEvents:finalTick.events.filter(event=>event.type==='completion').length,
    repeatedCompletionEvents:repeated.events.filter(event=>event.type==='completion').length,
    programSeconds:afterCompletion.joint.programs.map(program=>program.seconds),finaleSeconds:afterCompletion.joint.finale.seconds,
    completedProgress:afterCompletion.joint.finaleProgress,programs:structuredClone(game.state.joint.programs),
    credits:game.state.resources.C,publications:game.state.science.publications}};
}
if (import.meta.main) console.log(JSON.stringify(runSynthesisScenario(runHorizonsScenario(runEngineeringScenario(runPrestigeScenario().game).game).game).report,null,2));
