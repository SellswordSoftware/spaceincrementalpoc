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
  for (let i=0;i<2;i++) buy('appoint-educator');
  for (let i=0;i<3;i++) buy('outreach-activity');
  for (let i=0;i<2;i++) buy('appoint-fundraiser');
  buy('engineering-bench'); buy('engineering-bench'); buy('appoint-engineer'); buy('appoint-engineer');
  buy('radio-observatory'); buy('radio-dish'); buy('radio-timing'); buy('target-radio-sources');
  buy('flagship-grants'); for (let i=0;i<4;i++) buy('flagship-grant');
  buy('appoint-researcher'); buy('mentoring-program'); buy('science-practice');
  buy('space-program'); buy('orbital-partnerships');
  for (let i=0;i<3;i++) buy('orbital-grant');
  buy('mission-tooling'); buy('mission-tooling');
  buy('orbital-platform');
  const beforeFabrication=getSummary(game,definitions,balance).rates.E??0;
  buy('precision-fabrication');
  const afterFabrication=getSummary(game,definitions,balance).rates.E??0;
  buy('orbital-operations'); buy('orbital-payload'); buy('instrument-testbed'); buy('orbital-commissioning');
  buy('orbital-monitoring'); buy('target-transit-targets');
  buy('joint-science'); buy('infrared-partnerships');
  buy('infrared-grant'); buy('infrared-grant');
  buy('infrared-program'); buy('cryogenic-fabrication'); buy('infrared-calibration'); buy('infrared-mirror'); buy('infrared-shield'); buy('infrared-commissioning');
  buy('target-infrared-fields'); buy('target-deep-field');
  const after=getSummary(game,definitions,balance);
  return {game,report:{milestones,elapsedSeconds:(game.state.clock.tick-started)*TICK_SECONDS,
    beforeFabrication,afterFabrication,beforeData:before.rates.D??0,afterData:after.rates.D??0,missions:after.missions,frontier:after.frontier.name}};
}
if (import.meta.main) console.log(JSON.stringify(runHorizonsScenario(runEngineeringScenario(runPrestigeScenario().game).game).report,null,2));
