import assert from "node:assert/strict";
import test from "node:test";
import { core, TICK_SECONDS } from "../src/core/index.ts";
import { PlaytestLog } from "../src/diagnostics/playtest-log.ts";

// The rewrite deliberately differs from the prototype's frozen economy now.
test("analysis follows analytical investment; developed stations get useful assistance", () => {
  const game = core.createGame();
  game.state.purchases["analysis-tools"] = 1;
  game.state.purchases["observing-routine"] = 1;
  game.state.resources.D = 100;
  core.dispatch(game, { type: "processData", quantity: 100 });
  assert.equal(game.state.resources.K, 20);
  game.state.purchases["target-deep-field"] = 1;
  game.state.insight.upgrades["expansive-observing"] = 3;
  game.state.insight.upgrades["clear-analysis"] = 2;
  assert.equal(100 * 144 * 8 * core.analysisYield(game), 80);
  game.state.purchases["support-office"] = 1;
  game.state.purchases["appoint-fundraiser"] = 30;
  const before = core.productionRates(game).F;
  game.state.purchases["research-partnerships"] = 1;
  assert.equal(core.productionRates(game).F, before * 3);
  const help = core.actionOutput(game, "contact-supporters").F;
  assert.equal(help / TICK_SECONDS, core.productionRates(game).F * 0.5);
  core.dispatch(game, { type: "performStationAction", actionId: "contact-supporters" });
  assert.equal(game.state.resources.F, help);
});

test("old rewrite saves retain progress; the revised ending spends collaboration and resets", () => {
  const game = core.createGame();
  game.state.resources.K = 123;
  const old = {
    ...game,
    contentVersion: "0.16.0-pacing",
    simulationVersion: "0.16.0-pacing",
    balanceId: "pacing-v1",
    balanceHash: "fnv1a32-4eb033a4",
  };
  assert.deepEqual(core.deserializeGame(JSON.stringify(old)), game);
  // Prepared science buys results immediately; generation sets the pace, not project timers.
  for (const item of core.definitions.investments)
    if (item.kind !== "appointment") game.state.purchases[item.id] = 1;
  delete game.state.purchases["deep-field-catalog"];
  delete game.state.purchases["network-synthesis"];
  game.state.purchases.academy = 0;
  for (const id of ["joint-changing-sky", "joint-planetary-systems", "joint-deep-time"])
    game.state.purchases[id] = 1;
  game.state.population.total = 3;
  game.state.science.publications = 15000;
  for (const id of Object.keys(game.state.resources)) game.state.resources[id] = 1e9;
  for (const investmentId of ["deep-field-catalog", "network-synthesis"]) {
    const before = game.state.resources.C;
    const result = core.dispatch(game, { type: "buyInvestment", investmentId });
    assert.equal(result.ok, true, result.blockedReasons.join("; "));
    assert.equal(before - game.state.resources.C, result.costs.C);
  }
  assert.equal(game.state.joint.completedAtTick, 0);
  core.dispatch(game, { type: "beginPrestige" });
  assert.equal(game.state.joint.completedAtTick, null);
  assert.equal(game.state.resources.C, 0);
  assert.ok(game.state.insight.points > 0);
  assert.deepEqual(core.deserializeGame(core.serializeGame(game)), game);
});

test("playtest storage retains a campaign longer than the former limits", () => {
  const game = core.createGame(),
    log = new PlaytestLog(core);
  log.session(game, "test");
  for (let i = 0; i < 2200; i++) {
    core.advanceTicks(game, 120);
    log.advanced(game, 120);
  }
  const count = log.data.entries.length;
  assert.ok(count > 2000);
  assert.ok(log.storageJSON().length > 1500000);
  assert.equal(log.data.entries.length, count);
  assert.equal(JSON.parse(log.export()).entries.length, count);
  assert.equal(log.data.droppedEntries, 0);
});
