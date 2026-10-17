import { advanceTicks, balance, definitions, getSummary, serializeGame, deserializeGame, TICK_SECONDS } from '../src/core/index.js';
import { investor } from './invest.js';
import { runHorizonsScenario } from './horizons.js';
import { runEngineeringScenario } from './engineering.js';
import { runPrestigeScenario } from './prestige.js';

/** @param {import('../src/core/types.js').GameState} game */
export function runSynthesisScenario(game) {
  const started=game.state.clock.tick;
  /** @type {Record<string,number>} */
  const milestones={};
  const buy=investor(game,milestones);
  buy('joint-science'); buy('collaboration-practice'); buy('appoint-coordinator');
  buy('joint-changing-sky');
  const creditsBefore=game.state.resources.C;
  advanceTicks(game,definitions,balance,1);
  const creditsAfter=game.state.resources.C;
  buy('joint-planetary-systems'); buy('joint-deep-time');
  // Invest in team capacity rather than wait for compulsory project countdowns.
  buy('joint-changing-sky'); buy('joint-planetary-systems'); buy('joint-deep-time');
  const beforeUpgrades=getSummary(game,definitions,balance).rates;
  for (const id of ['coordinated-observing','shared-catalog','shared-instrumentation','shared-science']) buy(id);
  const afterUpgrades=getSummary(game,definitions,balance).rates;
  buy('network-integration');
  const result=buy('network-synthesis');
  const completedAtTick=game.state.joint.completedAtTick;
  const checkpoint=serializeGame(game);
  const resumed=serializeGame(deserializeGame(checkpoint))===checkpoint;
  const repeated=advanceTicks(game,definitions,balance,240);
  return {game,report:{milestones,elapsedSeconds:(game.state.clock.tick-started)*TICK_SECONDS,
    creditsBefore,creditsAfter,beforeUpgrades,afterUpgrades,resumed,completedAtTick,
    completionEvents:result?.events.filter(event=>event.type==='completion').length,
    repeatedCompletionEvents:repeated.events.filter(event=>event.type==='completion').length,
    credits:game.state.resources.C,publications:game.state.science.publications}};
}
if (import.meta.main) console.log(JSON.stringify(runSynthesisScenario(runHorizonsScenario(runEngineeringScenario(runPrestigeScenario().game).game).game).report,null,2));
