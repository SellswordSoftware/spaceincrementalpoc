import { balance, definitions, getSummary, TICK_SECONDS } from '../src/core/index.js';
import { investor } from './invest.js';
import { runEngineeringScenario } from './engineering.js';
import { runPrestigeScenario } from './prestige.js';

/** @param {import('../src/core/types.js').GameState} game */
export function runHorizonsScenario(game) {
  const started=game.state.clock.tick;
  /** @type {Record<string,number>} */
  const milestones={};
  const buy=investor(game,milestones);
  const before=getSummary(game,definitions,balance);
  for (let i=0;i<4;i++) buy('appoint-fundraiser');
  buy('engineering-bench'); buy('engineering-bench'); buy('appoint-engineer'); buy('appoint-engineer');
  buy('radio-observatory'); buy('radio-dish'); buy('radio-timing'); buy('target-radio-sources');
  buy('flagship-grants'); for (let i=0;i<4;i++) buy('flagship-grant');
  buy('appoint-researcher'); buy('mentoring-program'); buy('science-practice');
  buy('space-program'); buy('orbital-platform'); buy('orbital-operations'); buy('orbital-payload'); buy('orbital-commissioning');
  buy('orbital-monitoring'); buy('target-transit-targets');
  buy('infrared-program'); buy('infrared-calibration'); buy('infrared-mirror'); buy('infrared-shield'); buy('infrared-commissioning');
  buy('target-infrared-fields'); buy('target-deep-field');
  const after=getSummary(game,definitions,balance);
  return {game,report:{milestones,elapsedSeconds:(game.state.clock.tick-started)*TICK_SECONDS,
    beforeData:before.rates.D??0,afterData:after.rates.D??0,missions:after.missions,frontier:after.frontier.name}};
}
if (import.meta.main) console.log(JSON.stringify(runHorizonsScenario(runEngineeringScenario(runPrestigeScenario().game).game).report,null,2));
