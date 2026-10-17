import assert from 'node:assert/strict';
import test from 'node:test';
import { advanceTicks, balance, definitions, deserializeGame, serializeGame, dispatch, quoteCommand, getSummary } from '../src/core/index.js';
import { runStationScenario } from '../scenarios/stations.js';
import { runEngineeringScenario } from '../scenarios/engineering.js';
import { runHorizonsScenario } from '../scenarios/horizons.js';
import { runSynthesisScenario } from '../scenarios/synthesis.js';
import { runPacingComparison } from '../scenarios/pacing.js';
import { newOptions } from '../src/core/availability.js';

test('continuous science connects the first-run network to synthesis, then fully resets for Insight',()=>{
  const {report:pacing,game:rebuilt}=runPacingComparison();
  assert.equal(rebuilt.state.clock.totalTicks*.25,pacing.first.seconds+pacing.rebuilt.seconds);
  assert.equal(deserializeGame(serializeGame(rebuilt)).state.clock.totalTicks,rebuilt.state.clock.totalTicks);
  assert.ok(pacing.first.seconds>=480 && pacing.first.seconds<=720);
  assert.equal(pacing.first.encouraged,true);
  assert.ok(pacing.rebuilt.seconds<pacing.first.seconds*.7);
  assert.equal(rebuilt.state.clock.completedRuns[0].eligibleAtTick,pacing.first.seconds/.25);
  assert.equal(rebuilt.state.clock.completedRuns[0].endedAtTick,pacing.first.seconds/.25);
  const {game,report}=runStationScenario();
  assert.equal(report.firstCourseSeconds,40);
  assert.deepEqual(report.classroomAfter,[...report.classroomBefore,0]);
  assert.ok(report.scienceAfter>report.scienceBefore);
  assert.ok(quoteCommand(game,definitions,balance,{type:'buyInvestment',investmentId:'advanced-calibration'}).blockedReasons.some(reason=>reason.includes('5 cumulative Publications')));
  const before=game.state.science.publications;
  const rates=getSummary(game,definitions,balance).rates;
  advanceTicks(game,definitions,balance,1);
  assert.ok(Math.abs(game.state.science.publications-before-(rates.science??0)*.25)<1e-9);

  // Inspection works even when an option is unaffordable, and survives reload.
  const fresh=newOptions(game,definitions).find(item=>!quoteCommand(game,definitions,balance,{type:'buyInvestment',investmentId:item.id}).ok);
  assert.ok(fresh);
  const wallets={...game.state.resources};
  assert.equal(dispatch(game,definitions,balance,{type:'reviewOption',investmentId:fresh.id}).ok,true);
  assert.deepEqual(game.state.resources,wallets);
  assert.ok(!newOptions(deserializeGame(serializeGame(game)),definitions).some(item=>item.id===fresh.id));
  advanceTicks(game,definitions,balance,40);
  assert.ok(!newOptions(game,definitions).some(item=>item.id===fresh.id));

  const {report:engineering}=runEngineeringScenario(game);
  assert.ok(engineering.afterScience>engineering.beforeScience);
  assert.ok((engineering.grantCosts.D??0)>0 && (engineering.grantCosts.K??0)>0 && (engineering.grantCosts.I??0)>0);
  assert.equal(engineering.grantCosts.F,undefined);
  assert.ok(Math.abs(engineering.grantAfter-engineering.grantBefore*1.5)<1e-8);
  assert.equal(engineering.fundraiserAfter,engineering.fundraiserBefore);
  assert.ok(game.state.purchases['advanced-calibration']);
  assert.ok(game.state.purchases['research-grant']);
  const {report:horizons}=runHorizonsScenario(game);
  assert.ok(horizons.afterFabrication>horizons.beforeFabrication);
  assert.ok(horizons.missions.every(mission=>mission.commissioned && mission.rate>0));
  for (const id of ['orbital-operations','infrared-calibration','flagship-grant']) assert.ok(game.state.purchases[id]);
  const {report:synthesis}=runSynthesisScenario(game);
  assert.ok(synthesis.creditsAfter>synthesis.creditsBefore); // Rewards arrive on the first production tick.
  for (const currency of /** @type {const} */(['D','K','E','science'])) assert.ok((synthesis.afterUpgrades[currency]??0)>(synthesis.beforeUpgrades[currency]??0));
  assert.equal(synthesis.completionEvents,1);
  assert.equal(synthesis.repeatedCompletionEvents,0);
  assert.equal(synthesis.resumed,true);
  assert.ok(game.state.purchases['network-integration']);
  assert.ok(game.state.science.publications>=(definitions.investments.find(item=>item.id===definitions.finale.investmentId)?.publications??0));
  assert.equal(game.state.joint.completedAtTick,synthesis.completedAtTick);
  assert.equal(game.state.insight.totalEarned,0); // Entire route remains reachable before any prestige.
  assert.equal(game.state.clock.campaignIndex,1);
  assert.deepEqual(deserializeGame(serializeGame(game)),game);

  const totalBeforeReset=game.state.clock.totalTicks;
  assert.equal(dispatch(game,definitions,balance,{type:'beginPrestige'}).ok,true);
  assert.equal(game.state.clock.totalTicks,totalBeforeReset);
  assert.equal(game.state.clock.tick,0);
  const recordedRun=game.state.clock.completedRuns.at(-1);
  assert.ok(recordedRun && recordedRun.eligibleAtTick!==null && recordedRun.eligibleAtTick<recordedRun.endedAtTick);
  advanceTicks(game,definitions,balance,40);
  assert.equal(game.state.clock.totalTicks,totalBeforeReset); // The Insight shop is paused.
  assert.deepEqual(game.state.resources,balance.startingStocks);
  assert.deepEqual(game.state.purchases,{});
  assert.deepEqual(game.state.academy,{timers:[],remainder:0});
  assert.deepEqual(game.state.science,{publications:0});
  assert.deepEqual(game.state.joint,{completedAtTick:null});
  assert.deepEqual(game.state.reviewedOptions,[]);
  assert.equal(game.state.population.total,0);
  assert.equal(game.state.insight.phase,'shop');
  assert.ok(game.state.insight.points>0);
  assert.deepEqual(deserializeGame(serializeGame(game)),game);
});
