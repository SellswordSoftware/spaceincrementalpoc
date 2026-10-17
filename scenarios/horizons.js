import { advanceTicks, balance, definitions, dispatch, getSummary, quoteCommand, TICK_SECONDS } from '../src/core/index.js';
import { analysisYield } from '../src/core/rates.js';
import { runEngineeringScenario } from './engineering.js';
import { runPrestigeScenario } from './prestige.js';

/** An ordinary-command route from the mountain network through both space missions.
 * @param {import('../src/core/types.js').GameState} game */
export function runHorizonsScenario(game) {
  const started=game.state.clock.tick;
  /** @type {Record<string,number>} */
  const milestones={};
  /** @param {string} investmentId */
  function buy(investmentId) {
    const command=/** @type {const} */({type:'buyInvestment',investmentId});
    const deadline=game.state.clock.tick+24000;
    let quote=quoteCommand(game,definitions,balance,command);
    while (!quote.ok) {
      if (game.state.clock.tick>=deadline) throw new Error(`Horizons progression stalled at ${investmentId}`);
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
  // Strengthen established support/engineering rather than add a new funding source.
  buy('observing-grant'); buy('observing-grant');
  for (let index=0;index<4;index++) buy('appoint-fundraiser');
  buy('engineering-bench'); buy('engineering-bench'); buy('appoint-engineer'); buy('appoint-engineer');
  buy('radio-observatory'); buy('radio-dish'); buy('radio-timing'); buy('target-radio-sources');
  const radio=getSummary(game,definitions,balance);
  buy('space-program'); buy('orbital-platform'); buy('orbital-payload'); buy('orbital-commissioning');
  const orbitalAtCommission=structuredClone(game.state.missions.orbital);
  const orbitalData=getSummary(game,definitions,balance).branches.space.rate;
  const needsOrbitalResult=quoteCommand(game,definitions,balance,{type:'buyInvestment',investmentId:'infrared-program'}).blockedReasons.includes('Requires first completed orbital science cycle');
  buy('orbital-monitoring'); buy('target-transit-targets');
  const wallets={...game.state.resources};
  advanceTicks(game,definitions,balance,240);
  const firstOrbit=structuredClone(game.state.missions.orbital);
  const noOperatingDrain=Object.entries(wallets).every(([key,value])=>game.state.resources[/** @type {import('../src/core/types.js').StockId} */(key)]>=value);
  for (let index=0;index<4;index++) buy('appoint-fundraiser');
  buy('infrared-program'); buy('infrared-mirror'); buy('infrared-shield'); buy('infrared-commissioning');
  const infraredAtCommission=structuredClone(game.state.missions.infrared);
  const orbitalAtFlagship=structuredClone(game.state.missions.orbital);
  buy('target-infrared-fields');
  advanceTicks(game,definitions,balance,240);
  buy('target-deep-field');
  const after=getSummary(game,definitions,balance);
  return {game,report:{milestones,elapsedSeconds:(game.state.clock.tick-started)*TICK_SECONDS,
    beforeData:before.rates.D??0,radioData:radio.rates.D??0,orbitalData,afterData:after.rates.D??0,
    beforeCapacity:before.observing.capacity,afterCapacity:after.observing.capacity,
    beforeTelescopes:before.observing.telescopes,afterTelescopes:after.observing.telescopes,
    frontier:after.frontier.name,frontierYield:after.frontier.yield,orbitalAtCommission,infraredAtCommission,
    needsOrbitalResult,firstOrbit,noOperatingDrain,orbitalAtFlagship,missions:structuredClone(game.state.missions),
    scienceSeconds:after.science.seconds,missionSeconds:after.missions.map(mission=>mission.seconds)}};
}
if (import.meta.main) console.log(JSON.stringify(runHorizonsScenario(runEngineeringScenario(runPrestigeScenario().game).game).report,null,2));
