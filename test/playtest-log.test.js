import assert from 'node:assert/strict';
import test from 'node:test';
import { advanceTicks, balance, createGame, definitions, dispatch } from '../src/core/index.js';
import { PlaytestLog } from '../src/core/playtest-log.js';
import { runStationScenario } from '../scenarios/stations.js';

test('playtest log aggregates assistance, samples lulls, and retains the timeline across reset/reload',()=>{
  const game=createGame();
  let log=new PlaytestLog(definitions,balance);
  log.session(game,'start');
  for (let i=0;i<4;i++) {
    const before=log.snapshot(game);
    const command=/** @type {const} */({type:'performStationAction',actionId:'observe'});
    log.command(game,command,dispatch(game,definitions,balance,command),before);
    advanceTicks(game,definitions,balance,1);log.advanced(game,1);
  }
  log.flush();
  const activity=log.data.entries.at(-1);
  assert.equal(activity?.type,'activity');assert.equal(activity.detail.count,4);
  assert.equal(activity.after.stocks.D,4);
  advanceTicks(game,definitions,balance,116);log.advanced(game,116);
  const sample=log.data.entries.at(-1);
  assert.equal(sample?.type,'sample');assert.equal(sample.trackedSeconds,30);
  assert.ok((sample.sinceAction??0)>29);
  const {game:ready}=runStationScenario();
  log.mark(ready,'import');
  const before=log.snapshot(ready);
  const command=/** @type {const} */({type:'beginPrestige'});
  const result=dispatch(ready,definitions,balance,command);assert.equal(result.ok,true);
  log.command(ready,command,result,before);
  const reset=log.data.entries.at(-1);
  assert.equal(reset?.before?.run,1);assert.equal(reset.after.run,2);
  assert.equal(reset.after.runSeconds,0);assert.equal(reset.trackedSeconds,30);
  log=new PlaytestLog(definitions,balance,JSON.parse(log.storageJSON()));
  log.session(ready,'resume');
  assert.equal(log.data.trackedTicks,120);
  const exported=JSON.parse(log.export());
  assert.ok(exported.configurations[ready.balanceHash]);
  assert.ok(exported.entries.some(/** @param {{type:string}} entry */entry=>entry.type==='command'));
});
