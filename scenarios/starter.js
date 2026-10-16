import { advanceTicks, balance, createGame, definitions, dispatch, getSummary, quoteCommand, TICK_SECONDS } from '../src/core/index.js';

/** A scripted P3 path using ordinary commands and simulated time only.
 * @param {number} [startingFunding] Five Funding exercises a genuine zero-F state
 * immediately after buying outreach. The ordinary starter fixture uses 25.
 */
export function runStarterScenario(startingFunding = 25) {
  const config = { ...balance, startingStocks: { ...balance.startingStocks, F: startingFunding } };
  const game = createGame(definitions, config);
  /** @type {Record<string, number>} */
  const milestoneSeconds = {};
  let commandCount = 0;
  /** @param {import('../src/core/types.js').Command} command */
  function send(command) {
    const result = dispatch(game, definitions, config, command);
    if (!result.ok) throw new Error(`${command.type}: ${result.blockedReasons.join(', ')}`);
    commandCount++;
  }
  /** @param {number} ticks */
  function advance(ticks) {
    const result = advanceTicks(game, definitions, config, ticks);
    for (const event of result.events) if (event.type === 'unlocked') milestoneSeconds[event.id] = event.tick * TICK_SECONDS;
  }
  /** @param {() => boolean} ready */
  function waitUntil(ready) {
    const deadline = game.state.clock.tick + 3600 / TICK_SECONDS;
    while (!ready()) {
      if (game.state.clock.tick >= deadline) throw new Error('Starter scenario stalled for an hour of simulated time');
      advance(4);
    }
  }
  /** @param {string} recipeId @param {string|null} [instrumentId] */
  function activate(recipeId, instrumentId = null) {
    const recipe = definitions.recipes.find(item => item.id === recipeId);
    if (!recipe) throw new Error(`Unknown recipe ${recipeId}`);
    for (const job of game.state.jobs) {
      const other = definitions.recipes.find(item => item.id === job.recipeId);
      if (job.id !== recipeId && job.allocation > 0 && (instrumentId !== null && job.instrumentId === instrumentId || recipe.requiresFounder && other?.requiresFounder)) {
        send({ type: 'setJobAllocation', jobId: job.id, recipeId: job.recipeId, allocation: 0 });
      }
    }
    send({ type: 'setJobAllocation', jobId: recipeId, recipeId, instrumentId, allocation: 1 });
    if (recipe.requiresFounder) send({ type: 'setFounderTask', jobId: recipeId });
  }
  /** @param {string} targetId */
  const queued = targetId => game.state.data.filter(lot => lot.targetId === targetId).reduce((sum, lot) => sum + lot.quantity - lot.consumed, 0);
  /** @param {string} id */
  const unlocked = id => game.state.lifetime.unlocked.includes(id);
  /** @param {string} upgradeId */
  function buy(upgradeId) {
    /** @type {import('../src/core/types.js').Command} */
    const command = { type: 'buyUpgrade', upgradeId };
    waitUntil(() => quoteCommand(game, definitions, config, command).ok);
    send(command);
  }

  activate('observe-moon', 'founding-telescope');
  waitUntil(() => queued('moon') >= 10);
  activate('analyze-moon');
  waitUntil(() => unlocked('lunar-record'));
  buy('outreach');
  const fundingAfterOutreach = game.state.resources.F;
  activate('outreach-session', 'founding-telescope');
  advance(1);
  const fundingAfterRecoveryTick = game.state.resources.F;
  waitUntil(() => unlocked('outreach-milestone'));
  activate('observe-planet', 'founding-telescope');
  waitUntil(() => queued('bright-planet') >= 21);
  activate('analyze-planet');
  activate('outreach-session', 'founding-telescope');
  waitUntil(() => unlocked('planet-record'));
  buy('stable-mount');
  buy('tracking');

  // Gather a little reserve Knowledge before the camera/workstation investments.
  activate('observe-moon', 'founding-telescope');
  waitUntil(() => queued('moon') >= 85);
  activate('analyze-moon');
  activate('outreach-session', 'founding-telescope');
  waitUntil(() => game.state.resources.K >= 16);
  const reflector = /** @type {const} */ ({ type: 'purchaseInstrument', instrumentId: 'reflector' });
  waitUntil(() => quoteCommand(game, definitions, config, reflector).ok);
  send(reflector);
  buy('camera');
  buy('workstation');
  activate('camera-lunar-image', 'reflector');
  waitUntil(() => queued('lunar-image') >= 100);
  activate('analyze-image-workstation');
  waitUntil(() => unlocked('image-record'));

  const summary = getSummary(game, definitions, config);
  return { game, config, report: { startingFunding, seconds: summary.seconds, milestoneSeconds,
    fundingAfterOutreach, fundingAfterRecoveryTick, funding: game.state.resources.F,
    knowledge: game.state.resources.K, instruments: game.state.institution.instruments.length,
    firstInstrumentRole: game.state.jobs.find(job => job.instrumentId === 'founding-telescope' && job.allocation > 0)?.recipeId ?? 'idle',
    data: summary.data, commandCount } };
}

if (import.meta.main) {
  console.log(JSON.stringify(runStarterScenario(process.argv.includes('--low-funding') ? 5 : 25).report, null, 2));
}
