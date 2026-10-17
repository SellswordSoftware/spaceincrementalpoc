import { advanceTicks, balance, definitions, dispatch, getSummary, quoteCommand, TICK_SECONDS } from '../src/core/index.js';
import { analysisYield } from '../src/core/rates.js';
import { runPrestigeScenario } from './prestige.js';

/** Continue a rebuilt network through Engineering, spectroscopy and mountain facilities.
 * @param {import('../src/core/types.js').GameState} game */
export function runEngineeringScenario(game) {
  const started=game.state.clock.tick;
  /** @type {Record<string,number>} */
  const milestones={};
  /** @param {string} investmentId */
  function buy(investmentId) {
    const item=definitions.investments.find(item=>item.id===investmentId);
    if (item && (game.state.purchases[investmentId]??0)>=item.maxLevel) return;
    const command=/** @type {const} */({type:'buyInvestment',investmentId});
    const deadline=game.state.clock.tick+24000;
    let quote=quoteCommand(game,definitions,balance,command);
    while (!quote.ok) {
      if (game.state.clock.tick>=deadline) throw new Error(`Engineering progression stalled at ${investmentId}`);
      const needed=Math.max(0,(quote.costs.K??0)-game.state.resources.K);
      const quantity=Math.min(game.state.resources.D,needed/analysisYield(game,definitions,balance));
      if (quantity>1e-9) dispatch(game,definitions,balance,{type:'processData',quantity});
      advanceTicks(game,definitions,balance,1);
      quote=quoteCommand(game,definitions,balance,command);
    }
    const result=dispatch(game,definitions,balance,command);
    if (!result.ok) throw new Error(result.blockedReasons.join('; '));
    milestones[investmentId]=game.state.clock.tick*TICK_SECONDS;
  }
  const before=getSummary(game,definitions,balance);
  buy('engineering'); buy('engineering-bench'); buy('appoint-engineer'); buy('engineering-methods');
  const engineeringRate=getSummary(game,definitions,balance).rates.E??0;
  buy('permanent-enclosure'); buy('robotic-dome'); buy('spectrograph');
  const beforeSpectroscopy=getSummary(game,definitions,balance);
  const phases=[...game.state.science.timers];
  buy('stellar-spectroscopy');
  const afterSpectroscopy=getSummary(game,definitions,balance);
  const phasesAfter=[...game.state.science.timers];
  buy('expanded-observatory'); buy('target-galaxies'); buy('mountain-telescope'); buy('target-galaxy-clusters');
  const after=getSummary(game,definitions,balance);
  return {game,report:{milestones,elapsedSeconds:(game.state.clock.tick-started)*TICK_SECONDS,engineeringRate,
    beforeData:before.rates.D??0,afterData:after.rates.D??0,beforeCapacity:before.observing.capacity,afterCapacity:after.observing.capacity,
    beforeTelescopes:before.observing.telescopes,afterTelescopes:after.observing.telescopes,facility:after.observing.current.name,
    frontier:after.frontier.name,frontierYield:after.frontier.yield,beforeScienceReward:beforeSpectroscopy.science.reward,
    afterScienceReward:afterSpectroscopy.science.reward,scienceSeconds:afterSpectroscopy.science.seconds,phases,phasesAfter}};
}
if (import.meta.main) console.log(JSON.stringify(runEngineeringScenario(runPrestigeScenario().game).report,null,2));
