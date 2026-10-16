import { advanceTicks, balance, createGame, definitions, deserializeGame, dispatch, explainModifier, getSummary, quoteCommand, TICK_SECONDS } from '../core/index.js';
import { getUpgradeLevel, hasPrerequisite } from '../core/rates.js';
import { exportGame, loadGame, saveGame } from './storage.js';

/** @param {string} id */
function element(id) {
  const node = document.getElementById(id);
  if (!node) throw new Error(`Missing interface element: ${id}`);
  return node;
}
const task = /** @type {HTMLSelectElement} */ (element('task'));
const instrument = /** @type {HTMLSelectElement} */ (element('instrument'));
const outreachInstrument = /** @type {HTMLSelectElement} */ (element('outreach-instrument'));
const priorityJob = /** @type {HTMLSelectElement} */ (element('priority-job'));
const speedInput = /** @type {HTMLSelectElement} */ (element('speed'));
/** @param {string} id */
const number = id => Number(/** @type {HTMLInputElement} */ (element(id)).value);
/** @param {number} value */
const format = value => value.toLocaleString(undefined, { maximumFractionDigits: 2 });
/** @param {number} seconds */
const time = seconds => `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${(seconds % 60).toFixed(2).padStart(5, '0')}`;
/** @param {string} id */
const name = id => definitions.upgrades.find(item => item.id === id)?.name
  ?? definitions.instruments.find(item => item.id === id)?.name
  ?? definitions.recipes.find(item => item.id === id)?.name
  ?? ({ 'lunar-record': 'Lunar record', 'planet-record': 'Jupiter record', 'outreach-milestone': '10 cumulative Interest', 'image-record': 'First processed image', backyard: 'Backyard' })[id] ?? id;
/** @param {string} reason */
const reason = reason => reason.startsWith('Requires ') ? `Requires ${name(reason.slice(9))}`
  : reason.replace('Insufficient F', 'Insufficient Funding').replace('Insufficient K', 'Insufficient Knowledge');
/** @param {string} id */
const statName = id => ({ 'observing.capacity': 'observing utilization', 'analysis.capacity': 'analysis throughput', 'outreach.capacity': 'outreach capacity' })[id] ?? id;
/** @param {string} id */
const capabilityName = id => ({ outreach: 'outreach and donations', tracking: 'motorized tracking', imaging: 'camera imaging', fundedAnalysis: 'funded workstation analysis' })[id] ?? id;
/** @param {string} text @param {boolean} [error] */
function message(text, error = false) {
  element('message').textContent = text;
  element('message').classList.toggle('error', error);
}

let game = createGame();
let saveEnabled = true;
try {
  const stored = loadGame();
  if (stored) { game = stored; message('Observing campaign restored. Time is paused.'); }
} catch (error) {
  saveEnabled = false;
  message(`Stored save could not load: ${error instanceof Error ? error.message : error}. Start a new campaign or import a compatible save.`, true);
}
let running = false;
let speed = 1;
let accumulator = 0;
let lastFrame = performance.now();
let lastRender = 0;
let lastSave = 0;
let measuredAt = lastFrame;
let measuredTicks = 0;
/** @type {number|null} */
let actualSpeed = null;
/** @type {import('../core/types.js').GameEvent[]} */
let recentEvents = [];

function persist() {
  if (!saveEnabled) return;
  try {
    saveGame(game);
    element('save-status').textContent = 'Saved in this browser. Export JSON for a portable copy. No offline progress.';
  } catch (error) {
    element('save-status').textContent = `Local save unavailable: ${error instanceof Error ? error.message : error}. Export JSON to keep your progress.`;
  }
  lastSave = performance.now();
}
/** @param {import('../core/types.js').GameEvent[]} events */
function record(events) {
  recentEvents = [...events].reverse().concat(recentEvents).slice(0, 30);
}
/** @param {import('../core/types.js').Command} command */
function send(command) {
  const result = dispatch(game, definitions, balance, command);
  if (!result.ok) throw new Error(result.blockedReasons.map(reason).join('; '));
  record(result.events);
  saveEnabled = true;
}
/** @param {() => void} action @param {string} success */
function act(action, success) {
  try { action(); message(success); persist(); }
  catch (error) { message(error instanceof Error ? error.message : String(error), true); }
  render();
}
/** Pause displaced jobs through the same commands used by the headless scenario.
 * @param {string} recipeId @param {string|null} selectedInstrument @param {number} allocation
 */
function assign(recipeId, selectedInstrument, allocation) {
  const recipe = definitions.recipes.find(item => item.id === recipeId);
  if (!recipe) throw new Error('Choose an available task');
  for (const job of game.state.jobs) {
    const other = definitions.recipes.find(item => item.id === job.recipeId);
    if (job.id !== recipeId && job.allocation > 0 && (selectedInstrument !== null && job.instrumentId === selectedInstrument || recipe.requiresFounder && other?.requiresFounder)) {
      send({ type: 'setJobAllocation', jobId: job.id, recipeId: job.recipeId, allocation: 0 });
    }
  }
  send({ type: 'setJobAllocation', jobId: recipeId, recipeId, instrumentId: selectedInstrument, allocation });
  if (recipe.requiresFounder) send({ type: 'setFounderTask', jobId: recipeId });
}
/** @param {number} count */
function advance(count) { record(advanceTicks(game, definitions, balance, count).events); }

// Keep controls in place while counters refresh, preserving focus and unfinished edits.
/** @param {HTMLSelectElement} select @param {{id:string, name:string}[]} options */
function options(select, options) {
  const key = JSON.stringify(options);
  if (select.dataset.options === key) return;
  const previous = select.value;
  select.replaceChildren(...options.map(item => new Option(item.name, item.id)));
  if (options.some(item => item.id === previous)) select.value = previous;
  select.dataset.options = key;
}
/** @type {Map<string, Map<string, HTMLTableRowElement>>} */
const tables = new Map();
/** @param {string} bodyId @param {{id:string, cells:string[]}[]} rows */
function table(bodyId, rows) {
  let cache = tables.get(bodyId);
  if (!cache) { cache = new Map(); tables.set(bodyId, cache); }
  for (const [id, row] of cache) if (!rows.some(item => item.id === id)) { row.remove(); cache.delete(id); }
  for (const item of rows) {
    let row = cache.get(item.id);
    if (!row) {
      row = document.createElement('tr');
      row.dataset.id = item.id;
      for (const _ of item.cells) row.append(document.createElement('td'));
      cache.set(item.id, row);
      element(bodyId).append(row);
    }
    item.cells.forEach((text, index) => { if (row.cells[index].textContent !== text) row.cells[index].textContent = text; });
  }
}
/** @param {string} id @param {string[]} items */
function list(id, items) {
  const key = JSON.stringify(items);
  const container = element(id);
  if (container.dataset.items === key) return;
  container.replaceChildren(...items.map(text => { const li = document.createElement('li'); li.textContent = text; return li; }));
  container.dataset.items = key;
}
function updateInstruments() {
  const recipe = definitions.recipes.find(item => item.id === task.value);
  const instruments = game.state.institution.instruments.filter(item => recipe?.compatibleInstruments.includes(item.definitionId));
  options(instrument, instruments.length ? instruments.map(item => ({ id: item.id, name: name(item.definitionId) })) : [{ id: '', name: 'No instrument needed' }]);
  instrument.disabled = instruments.length === 0;
  const multiplier = recipe?.stat ? explainModifier(game, definitions, recipe.stat).multiplier : 1;
  const capacity = (recipe?.capacity ?? 0) * multiplier;
  element('task-help').textContent = recipe ? `Capacity: ${format(capacity * (recipe.activity && 'dataPerWork' in recipe.activity ? recipe.activity.dataPerWork : 1))} Data/s. Active Funding budget: ${format(capacity * (recipe.inputs.F ?? 0))}/s. ${recipe.activity?.kind === 'analyze' ? 'Processing stops when compatible Data runs out.' : recipe.activity?.kind === 'observe' ? 'New Data enters the queue for analysis.' : ''}` : 'The founder will be idle.';
}

/** @type {Map<string, {row:HTMLTableRowElement, button:HTMLButtonElement, cost:HTMLTableCellElement, status:HTMLElement}>} */
const purchases = new Map();
function renderPurchases() {
  const entries = [
    ...definitions.upgrades.map(upgrade => ({ id: upgrade.id, name: upgrade.name, visible: upgrade.revealPrerequisites.every(ref => hasPrerequisite(game, ref)) || getUpgradeLevel(game, upgrade.id) > 0,
      complete: getUpgradeLevel(game, upgrade.id) >= upgrade.maxLevel, level: getUpgradeLevel(game, upgrade.id),
      description: `${upgrade.effects.map(effect => effect.kind === 'unlock' ? `Enables ${capabilityName(effect.capability)}.` : `+${format((effect.value - 1) * 100)}% ${statName(effect.stat)} per level.`).join(' ')} ${upgrade.persistence.startsWith('campaign') ? 'Campaign upgrade.' : 'Retained between campaigns.'}`,
      command: /** @type {import('../core/types.js').Command} */ ({ type: 'buyUpgrade', upgradeId: upgrade.id }) })),
    ...definitions.instruments.filter(item => item.id !== 'starter-refractor').map(item => ({ id: item.id, name: item.name,
      visible: item.purchasePrerequisites.some(ref => hasPrerequisite(game, ref)), complete: game.state.institution.instruments.some(instrument => instrument.definitionId === item.id), level: 0,
      description: 'Adds an instrument; retains your founding telescope.', command: /** @type {import('../core/types.js').Command} */ ({ type: 'purchaseInstrument', instrumentId: item.id }) })),
  ];
  let visible = 0;
  for (const entry of entries) {
    let control = purchases.get(entry.id);
    if (!control) {
      const row = document.createElement('tr'); row.dataset.id = entry.id;
      const label = row.insertCell(); label.textContent = entry.name;
      const help = document.createElement('small'); help.textContent = entry.description; label.append(help);
      const cost = row.insertCell();
      const actions = row.insertCell();
      const button = document.createElement('button'); button.type = 'button'; button.dataset.purchase = entry.id;
      button.addEventListener('click', () => act(() => send(entry.command), `${entry.name} purchased.`));
      const status = document.createElement('small');
      actions.append(button, status); element('purchases').append(row);
      control = { row, cost, button, status }; purchases.set(entry.id, control);
    }
    control.row.hidden = !entry.visible;
    if (entry.visible) visible++;
    const quote = quoteCommand(game, definitions, balance, entry.command);
    control.cost.textContent = entry.complete ? '—' : Object.entries(quote.costs).map(([id, amount]) => `${format(amount)} ${id}`).join(' + ');
    control.button.textContent = entry.complete ? entry.id === 'analysis-throughput' ? 'Max level' : 'Owned' : entry.level ? `Buy level ${entry.level + 1}` : `Buy ${entry.name}`;
    control.button.disabled = entry.complete || !quote.ok;
    control.status.textContent = entry.complete ? 'Retained' : quote.ok ? 'Available' : quote.blockedReasons.map(reason).join('; ');
    if (entry.id === 'analysis-throughput' && entry.complete) control.status.textContent = 'Campaign upgrade';
    control.button.title = control.status.textContent;
  }
  element('purchases-empty').hidden = visible > 0;
}
/** @type {Map<string, {item:HTMLLIElement, label:HTMLElement, progress:HTMLProgressElement}>} */
const milestones = new Map();
function renderMilestones() {
  for (const gate of definitions.gates) {
    if (!gate.condition) continue;
    const visible = gate.prerequisites.every(ref => hasPrerequisite(game, ref));
    let row = milestones.get(gate.id);
    if (!row) {
      const item = document.createElement('li'); item.dataset.milestone = gate.id;
      const label = document.createElement('span');
      const progress = document.createElement('progress'); progress.max = gate.condition.quantity;
      progress.setAttribute('aria-label', name(gate.id)); item.append(label, progress); element('milestones').append(item);
      row = { item, label, progress }; milestones.set(gate.id, row);
    }
    row.item.hidden = !visible;
    const condition = gate.condition;
    const amount = condition.kind === 'interest' ? game.state.campaign.interestEarned
      : game.state.investigations.evidence.filter(item => item.targetId === condition.targetId).reduce((sum, item) => sum + item.quantity, 0);
    const complete = hasPrerequisite(game, gate.id);
    row.label.textContent = `${name(gate.id)}: ${complete ? 'complete' : `${format(amount)} / ${format(condition.quantity)}`}`;
    row.progress.value = complete ? condition.quantity : amount;
  }
}
function objective() {
  const steps = [
    ['lunar-record', 'Observe the Moon, then analyze 10 Data to make your first lunar record.'],
    ['outreach', 'Buy Share the sky to open outreach and sustainable donations.'],
    ['planet-record', 'Observe Jupiter, then analyze 20 compatible Data. Keep some extra observations for Knowledge.'],
    ['stable-mount', 'Buy the stable mount to improve observing utilization.'],
    ['tracking', 'Buy motorized tracking. Repeat observations and analysis if you need more Knowledge.'],
    ['outreach-milestone', 'Assign a telescope to outreach and earn 10 cumulative Public Interest.'],
    ['reflector', 'Save 100 Funding for a reflector. Outreach and donations support your observing work.'],
    ['camera', 'Buy the camera for 75 Funding and 10 Knowledge. Repeated Moon/Jupiter records still produce Knowledge.'],
    ['workstation', 'Buy the workstation for 50 Funding and 5 Knowledge to speed up analysis.'],
    ['image-record', 'Capture lunar images with the reflector, then process 100 camera Data at the workstation.'],
  ];
  return steps.find(([id]) => !hasPrerequisite(game, id))?.[1] ?? 'Starter program complete. Your first image is in the journal. The academy is the next implementation package.';
}
function render() {
  const summary = getSummary(game, definitions, balance);
  element('clock').textContent = time(summary.seconds);
  element('runtime-status').textContent = `Campaign ${summary.campaignIndex} · ${document.hidden ? 'Paused · tab hidden' : running ? `Running at ${speed}×${actualSpeed !== null && actualSpeed < speed * .9 ? ` (actual ${format(actualSpeed)}×)` : ''}` : 'Paused'}`;
  element('pause').textContent = running ? 'Pause' : 'Run';
  element('objective').textContent = objective();
  table('resources', summary.resources.filter(item => item.revealed).map(item => ({ id: item.id, cells: [`${definitions.resources.find(resource => resource.id === item.id)?.name ?? item.id} (${item.id})`, format(item.amount), format(item.grossRate), format(item.consumptionRate), `${item.netRate > 0 ? '+' : ''}${format(item.netRate)}`] })));
  const availableRecipes = definitions.recipes.filter(recipe => recipe.requiresFounder && recipe.prerequisites.every(id => hasPrerequisite(game, id)));
  options(task, [...availableRecipes.map(recipe => ({ id: recipe.id, name: recipe.name })), { id: 'idle', name: 'Idle — no active task' }]);
  updateInstruments();
  options(outreachInstrument, game.state.institution.instruments.map(item => ({ id: item.id, name: name(item.definitionId) })));
  list('instruments', game.state.institution.instruments.map(item => `${name(item.definitionId)} — ${game.state.jobs.filter(job => job.instrumentId === item.id && job.allocation > 0).map(job => name(job.recipeId)).join(', ') || 'available'}`));
  const current = game.state.jobs.find(job => job.id === game.state.population.founder.task);
  const currentPlan = summary.jobs.find(job => job.jobId === current?.id);
  element('current-task').textContent = current && current.allocation > 0 ? `${name(current.recipeId)} · ${currentPlan?.blockedReasons.map(reason).join('; ') || 'ready to work'}` : 'Founder is idle.';
  renderPurchases();
  const visibleTargets = availableRecipes.filter(recipe => recipe.activity?.kind === 'observe').map(recipe => recipe.activity?.kind === 'observe' ? recipe.activity.targetId : '');
  table('data', summary.data.filter(item => visibleTargets.includes(item.targetId)).map(item => ({ id: item.targetId, cells: [definitions.targets.find(target => target.id === item.targetId)?.name ?? item.targetId, format(item.queued), format(item.evidence), format(item.acquisitionRate), format(item.processingRate)] })));
  renderMilestones();
  element('outreach-panel').hidden = !hasPrerequisite(game, 'outreach');
  const outreach = game.state.jobs.find(job => job.recipeId === 'outreach-session');
  const donation = summary.resources.find(item => item.id === 'F');
  element('outreach-status').textContent = `${format(game.state.resources.I)} / ${format(summary.audience.cap ?? 0)} Interest · ${format(summary.audience.donations * 100)}% audience for donations · donations ${format(donation?.grossRate ?? 0)} Funding/s · ${outreach?.allocation ? 'outreach assigned' : 'no outreach instrument assigned'}.`;
  /** @type {HTMLButtonElement} */ (element('stop-outreach')).disabled = !outreach?.allocation;
  const activeJobs = summary.jobs.filter(item => game.state.jobs.some(job => job.id === item.jobId && job.allocation > 0) && definitions.recipes.find(recipe => recipe.id === item.recipeId)?.prerequisites.every(id => hasPrerequisite(game, id)));
  table('jobs', activeJobs.map(item => ({ id: item.jobId, cells: [name(item.recipeId), format(item.work / TICK_SECONDS), format((item.inputs.F ?? 0) / TICK_SECONDS),
    [item.dataOutput ? `${format(item.dataOutput.quantity / TICK_SECONDS)} Data` : '', ...Object.entries(item.outputs).filter(([, amount]) => amount > 0).map(([id, amount]) => `${format(amount / TICK_SECONDS)} ${id}`)].filter(Boolean).join(', ') || '—',
    [item.blockedReasons.map(reason).join('; ') || 'Working', ...(item.modifier?.contributions.map(modifier => `${name(modifier.upgradeId)} +${format(modifier.bonus * 100)}%`) ?? [])].join(' · ')] })));
  options(priorityJob, activeJobs.map(item => ({ id: item.jobId, name: `${name(item.recipeId)} (priority ${game.state.jobs.find(job => job.id === item.jobId)?.priority ?? 0})` })));
  list('journal', game.state.lifetime.journal.map(id => definitions.targets.find(target => target.id === id)?.permittedClaim ?? id).concat(game.state.lifetime.journal.length ? [] : ['No records yet.']));
  list('events', recentEvents.map(event => `${time(event.tick * TICK_SECONDS)} · ${({ unlocked: 'Completed', buyUpgrade: 'Purchased', purchaseInstrument: 'Added instrument', setJobAllocation: 'Assigned work', setFounderTask: 'Founder task', setAudienceAllocation: 'Audience allocation', setJobPriority: 'Priority updated', jobCompleted: 'Finished work' })[event.type] ?? 'Activity'} · ${name(event.id)}`).concat(recentEvents.length ? [] : ['No activity in this session.']));
}

/** @param {string} id @param {() => void} action @param {string} success */
function form(id, action, success) {
  element(id).addEventListener('submit', event => { event.preventDefault(); act(action, success); });
}
task.addEventListener('change', updateInstruments);
form('founder-form', () => {
  if (task.value === 'idle') {
    for (const job of game.state.jobs) if (definitions.recipes.find(recipe => recipe.id === job.recipeId)?.requiresFounder && job.allocation > 0) send({ type: 'setJobAllocation', jobId: job.id, recipeId: job.recipeId, allocation: 0 });
    send({ type: 'setFounderTask', jobId: null });
  } else assign(task.value, instrument.disabled ? null : instrument.value, number('allocation'));
}, 'Founder assignment updated.');
form('outreach-form', () => assign('outreach-session', outreachInstrument.value, number('outreach-allocation')), 'Outreach assignment updated.');
form('audience-form', () => send({ type: 'setAudienceAllocation', donations: number('donation-share') / 100, recruitment: 0 }), 'Audience allocation updated.');
form('priority-form', () => send({ type: 'setJobPriority', jobId: priorityJob.value, priority: number('priority-value') }), 'Job priority updated.');
element('stop-outreach').addEventListener('click', () => act(() => {
  const job = game.state.jobs.find(job => job.recipeId === 'outreach-session');
  if (job) send({ type: 'setJobAllocation', jobId: job.id, recipeId: job.recipeId, allocation: 0 });
}, 'Outreach stopped. Existing supporters still donate.'));
element('pause').addEventListener('click', () => {
  running = !running;
  lastFrame = performance.now(); measuredAt = lastFrame; measuredTicks = 0; actualSpeed = null;
  if (!running) persist();
  render();
});
speedInput.addEventListener('change', () => { speed = Number(speedInput.value); measuredAt = performance.now(); measuredTicks = 0; actualSpeed = null; render(); });
for (const [id, ticks] of [['step', 1], ['advance-10', 40], ['advance-60', 240]]) {
  element(String(id)).addEventListener('click', () => act(() => { running = false; advance(Number(ticks)); }, `Advanced ${Number(ticks) * TICK_SECONDS} simulated seconds. Time is paused.`));
}
element('export').addEventListener('click', () => act(() => exportGame(game), 'Save exported as JSON.'));
const importInput = /** @type {HTMLInputElement} */ (element('import'));
importInput.addEventListener('change', async () => {
  const file = importInput.files?.[0];
  if (!file) return;
  try {
    const candidate = deserializeGame(await file.text());
    game = candidate; running = false; accumulator = 0; recentEvents = []; saveEnabled = true;
    render(); restoreInputs(); persist(); message('Save imported. Time is paused.');
  } catch (error) { message(`Import failed: ${error instanceof Error ? error.message : error}`, true); }
  importInput.value = '';
});
element('restart').addEventListener('click', () => {
  if (!confirm('Start a new observing campaign? This replaces your current browser save. Export it first if you want to keep it.')) return;
  game = createGame(); running = false; accumulator = 0; recentEvents = []; saveEnabled = true;
  render(); restoreInputs(); persist(); message('New observing campaign. Choose a founder task to begin.');
});
function restoreInputs() {
  const current = game.state.jobs.find(job => job.id === game.state.population.founder.task);
  task.value = current?.recipeId ?? 'observe-moon';
  if (!Array.from(task.options).some(option => option.value === task.value)) task.selectedIndex = 0;
  updateInstruments();
  if (current?.instrumentId) instrument.value = current.instrumentId;
  /** @type {HTMLInputElement} */ (element('allocation')).value = String(current?.allocation ?? 1);
  const outreach = game.state.jobs.find(job => job.recipeId === 'outreach-session');
  outreachInstrument.value = outreach?.instrumentId ?? 'founding-telescope';
  /** @type {HTMLInputElement} */ (element('outreach-allocation')).value = String(outreach?.allocation || 1);
  /** @type {HTMLInputElement} */ (element('donation-share')).value = String(game.state.preferences.audience.donations * 100);
}
document.addEventListener('visibilitychange', () => {
  lastFrame = performance.now(); measuredAt = lastFrame; measuredTicks = 0;
  if (document.hidden) persist();
  render();
});
window.addEventListener('pagehide', persist);
/** @param {number} now */
function frame(now) {
  const elapsed = Math.max(0, (now - lastFrame) / 1000);
  lastFrame = now;
  if (running && !document.hidden) {
    accumulator += elapsed * speed;
    const ticks = Math.min(100, Math.floor(accumulator / TICK_SECONDS));
    if (ticks > 0) {
      try { advance(ticks); accumulator -= ticks * TICK_SECONDS; measuredTicks += ticks; }
      catch (error) { running = false; message(`Simulation paused: ${error instanceof Error ? error.message : error}`, true); }
    }
  }
  if (now - measuredAt >= 1000) { actualSpeed = measuredTicks * TICK_SECONDS * 1000 / (now - measuredAt); measuredAt = now; measuredTicks = 0; }
  if (now - lastRender >= 200) { render(); lastRender = now; }
  if (!document.hidden && now - lastSave >= 5000) persist();
  requestAnimationFrame(frame);
}
render();
restoreInputs();
requestAnimationFrame(frame);
