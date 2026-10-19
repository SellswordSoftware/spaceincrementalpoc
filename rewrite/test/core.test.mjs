import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdtemp, readFile, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import test from "node:test";
import * as port from "../src/core/index.ts";
import { PlaytestLog } from "../src/diagnostics/playtest-log.ts";

// Reuse the prototype's ordinary-command scenarios without copying a second test policy.
// Their core imports go through an adapter comparing both engines at every operation.
test("TypeScript matches the prototype through growth, completion, save/load and prestige", async () => {
  assert.equal("document" in globalThis, false);
  const directory = await mkdtemp(join(tmpdir(), "eyes-core-parity-"));
  try {
    // The prototype continues evolving; compare against the recorded port baseline.
    const revision = "3a504e0ed4956a30c4f7005c9744e03c85b9fe02";
    const archive = execFileSync(
      "git",
      ["archive", revision, "src/core", "src/definitions", "scenarios"],
      {
        cwd: fileURLToPath(new URL("../../", import.meta.url)),
      },
    );
    execFileSync("tar", ["-x", "-C", directory], { input: archive });
    await writeFile(join(directory, "package.json"), '{"type":"module"}');
    const base = pathToFileURL(`${directory}/`);
    const legacy = await import(new URL("src/core/index.js", base).href);
    assert.deepEqual(port.definitions, legacy.definitions);
    assert.deepEqual(port.balance, legacy.balance);
    assert.deepEqual(port.core.createGame(), legacy.createGame());
    const moduleURL = pathToFileURL(join(directory, "adapter.mjs")).href;
    const adapter = `
      import assert from 'node:assert/strict';
      import * as oldCore from '${new URL("src/core/index.js", base)}';
      import * as oldEconomy from '${new URL("src/core/rates.js", base)}';
      import * as newCore from '${new URL("../src/core/index.ts", import.meta.url)}';
      const old = { ...oldCore, ...oldEconomy }, next = newCore.core;
      const mirrors = new WeakMap();
      export const definitions = old.definitions, balance = old.balance, TICK_SECONDS = old.TICK_SECONDS;
      function invoke(name, args) {
        const converted = args.filter(arg => arg !== definitions && arg !== balance).map(arg => {
          if (!arg?.state) return arg;
          if (!mirrors.has(arg)) mirrors.set(arg, structuredClone(arg));
          return mirrors.get(arg);
        });
        const expected = old[name](...args), actual = next[name](...converted);
        assert.deepEqual(actual, expected, name);
        if (expected?.state) mirrors.set(expected, actual);
        if (args[0]?.state) assert.deepEqual(converted[0], args[0], name + ' state');
        return expected;
      }
      ${["createGame", "dispatch", "quoteCommand", "advanceTicks", "getSummary", "serializeGame", "deserializeGame", "previewPrestige", "analysisYield", "scaledOutput"].map((name) => `export const ${name} = (...args) => invoke('${name}', args);`).join("\n")}
    `;
    await writeFile(join(directory, "adapter.mjs"), adapter);
    for (const name of ["stations", "invest", "prestige", "engineering", "horizons", "synthesis"]) {
      const source = await readFile(new URL(`scenarios/${name}.js`, base), "utf8");
      await writeFile(
        join(directory, `${name}.mjs`),
        source
          .replace(/'\.\.\/src\/core\/(?:index|rates)\.js'/g, JSON.stringify(moduleURL))
          .replace(/'\.\/(\w+)\.js'/g, "'./$1.mjs'"),
      );
    }
    const load = (name) => import(pathToFileURL(join(directory, `${name}.mjs`)).href);
    const { runStationScenario } = await load("stations");
    const { runEngineeringScenario } = await load("engineering");
    const { runHorizonsScenario } = await load("horizons");
    const { runSynthesisScenario } = await load("synthesis");
    const { runPrestigeScenario } = await load("prestige");
    const { game } = runStationScenario();
    runEngineeringScenario(game);
    runHorizonsScenario(game);
    runSynthesisScenario(game);
    assert.ok(game.state.joint.completedAtTick > 0);
    const completed = port.core.deserializeGame(legacy.serializeGame(game));
    assert.equal(port.core.serializeGame(completed), legacy.serializeGame(game));
    // The previous balance-only save migrates to the same economic state in both engines.
    const previous = {
      ...game,
      contentVersion: "0.15.0-production",
      simulationVersion: "0.15.0-production",
      balanceId: "production-v1",
      balanceHash: "fnv1a32-66e896fc",
    };
    assert.deepEqual(
      port.core.deserializeGame(JSON.stringify(previous)),
      legacy.deserializeGame(JSON.stringify(previous)),
    );
    const log = new PlaytestLog(port.core);
    log.session(completed, "parity");
    port.core.advanceTicks(completed, 120);
    log.advanced(completed, 120);
    assert.equal(log.data.entries.at(-1).type, "sample");
    const before = log.snapshot(completed);
    const command = { type: "beginPrestige" };
    const result = port.core.dispatch(completed, command);
    assert.equal(result.ok, true);
    log.command(completed, command, result, before);
    const resumedLog = new PlaytestLog(port.core, JSON.parse(log.storageJSON()));
    assert.equal(JSON.parse(resumedLog.export()).entries.at(-1).after.run, 2);
    assert.equal(resumedLog.data.trackedTicks, 120);
    assert.equal(completed.state.insight.phase, "shop");
    assert.deepEqual(port.core.deserializeGame(port.core.serializeGame(completed)), completed);
    runPrestigeScenario();
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});
