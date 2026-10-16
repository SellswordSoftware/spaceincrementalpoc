import { advanceTicks, balance, createGame, definitions, deserializeGame, dispatch, getSummary, quoteCommand, TICK_SECONDS } from '../core/index.js';
import { getPurchaseCount, hasPrerequisite, scaledOutput, analysisYield, previewInvestment, insightMultiplier } from '../core/rates.js';
import { currencyName } from '../core/commands.js';
import { backupPreviousSave, downloadSave, exportGame, loadGame, saveGame, storedSave } from './storage.js';

/** @param {string} id */
function el(id) { const node=document.getElementById(id); if (!node) throw new Error(`Missing ${id}`); return node; }
/** @param {ParentNode} scope @param {string} selector */
function q(scope,selector) {
  const node=scope.querySelector(selector);
  if (!(node instanceof HTMLElement)) throw new Error(`Missing ${selector}`);
  return node;
}
/** @param {number} value */
const fmt = value => value.toLocaleString(undefined,{maximumFractionDigits:2});
/** @param {import('../core/types.js').Costs} costs */
const price = costs => Object.entries(costs).map(([key,value]) => `${fmt(value)} ${key==='N'&&value===1?'unassigned person':currencyName(definitions,key)}`).join(' + ');
/** @param {string} text @param {boolean} [error] */
function message(text,error=false) { el('message').textContent=text; el('message').classList.toggle('error',error); }
/** @param {string[]} requires */
const meets = requires => requires.every(id => hasPrerequisite(game,id));

let game=createGame();
let running=true;
let reviewingPrestige=false;
let resumeAfterReview=false;
let speed=1;
let accumulator=0;
let lastFrame=performance.now();
let lastRender=0;
let lastSave=performance.now();
let saveEnabled=true;
let oldSave='';
let awaitingNewRun=false;
/** @type {string|null} */
let heldAction=null;
/** @type {import('../core/types.js').GameEvent[]} */
let recentEvents=[];
try {
  const restored=loadGame();
  if (restored) { game=restored; running=false; message(game.state.insight.phase==='shop'?'Insight shop restored. Choose modifiers, then begin the next run.':'Station network restored. Press Run to continue.'); }
} catch (error) {
  running=false; saveEnabled=false;
  try { oldSave=storedSave() ?? ''; } catch { /* Browser storage may be unavailable. */ }
  awaitingNewRun=Boolean(oldSave);
  el('old-save').hidden=!awaitingNewRun;
  if (awaitingNewRun) el('old-save-message').textContent=`${error instanceof Error ? error.message : 'Previous save could not load.'} Your previous save remains untouched. Export it, then start the station prototype when ready.`;
  message(awaitingNewRun ? 'Export your previous save or start the new station economy above.' : 'Local storage is unavailable. You can still play and export your run.',true);
}

/** @param {import('../core/types.js').GameEvent[]} events */
function record(events) {
  recentEvents=[...events,...recentEvents].slice(0,20);
  if (events.some(event => event.type==='graduate' || event.type==='record' || event.type==='publication')) message(events.find(event => event.type==='graduate' || event.type==='record' || event.type==='publication')?.detail ?? 'Milestone completed.');
}
function persist() {
  if (!saveEnabled) return;
  try { saveGame(game); el('save-status').textContent='Saved in this browser. Reload resumes paused. Export for a portable copy. No offline progress.'; }
  catch { el('save-status').textContent='Local saving is unavailable. Export JSON to keep this run.'; }
  lastSave=performance.now();
}
/** @param {import('../core/types.js').Command} command @param {boolean} [quiet] */
function send(command,quiet=false) {
  if (awaitingNewRun) return;
  const result=dispatch(game,definitions,balance,command);
  if (!result.ok) { if (!quiet) message(result.blockedReasons.join(' · '),true); return; }
  if (command.type==='beginPrestige') {
    stopHold(); running=false; accumulator=0; reviewingPrestige=false; recentEvents=[];
  } else if (command.type==='startNextRun') {
    stopHold(); running=true; accumulator=0; reviewingPrestige=false;
  }
  record(result.events);
  if (!quiet && command.type!=='performStationAction') {
    if (command.type==='beginPrestige') message(`Earned ${game.state.insight.lastAward} Insight. Choose permanent modifiers before rebuilding.`);
    else if (command.type==='buyInsightUpgrade') message('Permanent Insight modifier purchased.');
    else if (command.type==='startNextRun') message(`Run ${game.state.clock.campaignIndex} begins. Rebuild with your permanent Insight modifiers.`);
    else if (command.type==='buyInvestment') message(`${definitions.investments.find(item => item.id===command.investmentId)?.name}: added to the network.`);
    else if (command.type==='processData') message(`Processed ${fmt(command.quantity)} Data → ${fmt(command.quantity*analysisYield(game,definitions,balance))} Knowledge. Observations continue.`);
    else if (command.type==='startProgram') message('Scientific study paid in full. Publication work is underway.');
    else message('Course paid in full. Teaching is underway.');
  }
  if (!quiet) { persist(); render(); }
}
/** @param {number} ticks */
function advance(ticks) {
  if (awaitingNewRun || reviewingPrestige || game.state.insight.phase==='shop') return;
  if (!heldAction) record(advanceTicks(game,definitions,balance,ticks).events);
  else for (let index=0;index<ticks;index++) {
    send({type:'performStationAction',actionId:heldAction},true);
    record(advanceTicks(game,definitions,balance,1).events);
  }
}
function stopHold() {
  heldAction=null;
  document.querySelectorAll('.is-held').forEach(node => node.classList.remove('is-held'));
}
/** @param {string} actionId */
function startHold(actionId) {
  if (awaitingNewRun || reviewingPrestige || game.state.insight.phase==='shop') return;
  const action=definitions.actions.find(item => item.id===actionId);
  if (!action || !meets(action.requires) || action.output.training && !game.state.course || action.output.science && !game.state.science.program) return;
  stopHold(); heldAction=actionId; running=true;
  q(document,`[data-action="${actionId}"]`)?.classList.add('is-held');
  send({type:'performStationAction',actionId},true);
  render();
}

// Build each station once. Updating text preserves keyboard focus and held inputs.
for (const station of definitions.stations) {
  const section=document.createElement('section');
  section.className='station'; section.dataset.station=station.id; section.id=`station-${station.id}`;
  section.setAttribute('aria-labelledby',`heading-${station.id}`);
  section.innerHTML=`<div class="station-header"><div><p class="eyebrow"></p><h2 id="heading-${station.id}"></h2></div><span class="station-icon" aria-hidden="true"></span></div><p class="station-info"></p><div class="station-body"><div class="station-income"><strong></strong><span></span><small></small></div><div class="station-actions"></div><div class="station-extra"></div></div><div class="station-purchases"></div>`;
  q(section,'.eyebrow').textContent=station.subtitle;
  q(section,'h2').textContent=station.name;
  q(section,'.station-icon').textContent=({observatory:'✧',analysis:'◈',outreach:'☀',support:'❧',academy:'⌂',research:'✦',science:'⌁'})[station.id];
  q(section,'.station-info').textContent=station.use;
  const actions=q(section,'.station-actions');
  for (const action of definitions.actions.filter(item => item.station===station.id)) {
    const button=document.createElement('button');
    button.type='button'; button.className='action'; button.dataset.action=action.id;
    const heading=document.createElement('strong'); heading.textContent=action.name;
    const yieldText=document.createElement('span');
    yieldText.textContent=Object.entries(action.output).map(([key,value]) => `+${fmt(value)} ${key==='training'?'course work':key==='science'?'study work':currencyName(definitions,key)}`).join(', ');
    button.append(heading,yieldText); actions?.append(button);
    const help=document.createElement('p'); help.className='action-help'; help.dataset.actionHelp=action.id;
    help.textContent='Click or hold to help here. All passive stations keep running.'; actions?.append(help);
    button.addEventListener('pointerdown',event => {
      if (event.button!==0) return;
      button.setPointerCapture(event.pointerId); startHold(action.id);
    });
    button.addEventListener('pointerup',stopHold); button.addEventListener('pointercancel',stopHold);
    button.addEventListener('lostpointercapture',stopHold);
    button.addEventListener('keydown',event => {
      if (event.code==='Space' || event.code==='Enter') { event.preventDefault(); if (!event.repeat) startHold(action.id); }
    });
    button.addEventListener('keyup',event => { if (event.code==='Space' || event.code==='Enter') { event.preventDefault(); stopHold(); } });
    button.addEventListener('blur',stopHold);
    // Assistive technology and programmatic button activation use the same action.
    button.addEventListener('click',event => { if (event.detail===0) { startHold(action.id); stopHold(); } });
  }
  if (station.id==='observatory') {
    const info=document.createElement('p'); info.id='observing-breakdown'; info.className='small';
    const owned=document.createElement('p'); owned.id='observing-owned'; owned.className='small';
    q(section,'.station-extra').append(info,owned);
  }
  if (station.id==='analysis') {
    const extra=q(section,'.station-extra');
    const info=document.createElement('p'); info.className='small'; info.id='analysis-yield';
    const buttons=document.createElement('div'); buttons.className='process-buttons';
    for (const batch of [10,'all']) {
      const button=document.createElement('button'); button.dataset.process=String(batch);
      button.addEventListener('click',()=>send({type:'processData',quantity:batch==='all'?game.state.resources.D:10}));
      buttons.append(button);
    }
    const note=document.createElement('p'); note.className='small'; note.textContent='Analyze for Knowledge now, or buy archive research below for Knowledge per second. Observing continues either way.';
    extra.append(info,buttons,note);
  }
  if (station.id==='science') {
    const extra=q(section,'.station-extra');
    for (const program of definitions.programs) {
      const card=document.createElement('div'); card.className='program-card'; card.dataset.program=program.id;
      const title=document.createElement('h3'); title.textContent=program.name;
      const description=document.createElement('p'); description.className='small'; description.textContent=program.description;
      const cost=document.createElement('p'); cost.className='small'; cost.textContent=`${price(program.cost)}, paid once · ${program.work} work · ${program.publications} Publication on completion. Repeat studies pay for a new sample.`;
      const button=document.createElement('button'); button.dataset.startProgram=program.id;
      button.addEventListener('click',()=>send({type:'startProgram',programId:program.id}));
      const progress=document.createElement('progress'); progress.dataset.programProgress=program.id; progress.max=program.work; progress.setAttribute('aria-label',`${program.name} progress`);
      const status=document.createElement('p'); status.className='course-info'; status.dataset.programStatus=program.id;
      card.append(title,description,cost,button,progress,status); extra.append(card);
    }
  }
  if (station.id==='support') {
    const status=document.createElement('p'); status.id='grant-status'; status.className='small'; q(section,'.station-extra').append(status);
  }
  if (station.id==='academy') {
    const extra=q(section,'.station-extra');
    const info=document.createElement('p'); info.className='course-info'; info.textContent=`One course: ${price(balance.course.cost)}, paid once up front. ${balance.course.work} work to graduate. No wages or recurring tuition.`;
    const enroll=document.createElement('button'); enroll.id='enroll'; enroll.addEventListener('click',() => send({type:'enrollCourse'}));
    const progress=document.createElement('progress'); progress.id='course-progress'; progress.max=balance.course.work; progress.setAttribute('aria-label','Paid course progress');
    const status=document.createElement('p'); status.id='course-status'; status.className='course-info';
    const limit=document.createElement('p'); limit.id='course-limit'; limit.className='course-info';
    extra?.append(info,enroll,progress,status,limit);
  }
  const purchases=q(section,'.station-purchases');
  const label=document.createElement('p'); label.className='section-label'; label.textContent='Invest in this station'; purchases?.append(label);
  for (const item of definitions.investments.filter(item => item.station===station.id)) {
    const row=document.createElement('div'); row.className='purchase'; row.dataset.investment=item.id;
    const head=document.createElement('div'); head.className='purchase-head';
    const title=document.createElement('h3'); title.textContent=item.name;
    const count=document.createElement('span'); count.className='owned'; head.append(title,count);
    const effect=document.createElement('p'); effect.textContent=item.effect;
    const gain=document.createElement('p'); gain.className='purchase-gain';
    const button=document.createElement('button'); button.dataset.buy=item.id;
    const verb=document.createElement('span'); verb.textContent=item.kind==='appointment'?'Appoint permanently':item.kind==='producer'?'Add producer':item.kind==='unlock'?'Unlock':item.kind==='discovery'?'Research':'Improve';
    const cost=document.createElement('small'); button.append(verb,cost);
    button.addEventListener('click',() => send({type:'buyInvestment',investmentId:item.id}));
    const reason=document.createElement('span'); reason.className='blocked';
    row.append(head,effect,gain,button,reason); purchases?.append(row);
  }
  el('stations').append(section);
}

// Stable shop buttons preserve focus while prices and modifiers update.
for (const upgrade of definitions.insightUpgrades) {
  const card=document.createElement('div'); card.className='insight-card'; card.dataset.insightUpgrade=upgrade.id;
  const title=document.createElement('h3'); title.textContent=upgrade.name;
  const description=document.createElement('p'); description.textContent=upgrade.description;
  const current=document.createElement('p'); current.className='small'; current.dataset.insightEffect=upgrade.id;
  const button=document.createElement('button'); button.dataset.buyInsight=upgrade.id;
  button.addEventListener('click',()=>send({type:'buyInsightUpgrade',upgradeId:upgrade.id}));
  card.append(title,description,current,button); el('insight-upgrades').append(card);
}
/** @type {Record<import('../core/types.js').StatId,string>} */
const statNames={observing:'Data',analysis:'Knowledge',outreach:'Interest',support:'Funding',teaching:'Teaching',research:'Expertise',science:'Study work'};
function renderPrestige() {
  const preview=getSummary(game,definitions,balance).prestige;
  const shop=game.state.insight.phase==='shop';
  const insight=game.state.insight;
  el('run-label').textContent=`Run ${game.state.clock.campaignIndex}`;
  el('review-prestige').hidden=shop || !(hasPrerequisite(game,'research') || insight.totalEarned>0);
  /** @type {HTMLButtonElement} */(el('review-prestige')).disabled=awaitingNewRun || reviewingPrestige;
  el('review-prestige').textContent=preview.eligible?`Prestige · +${preview.award} Insight`:'Review prestige';
  el('prestige-panel').hidden=!shop && !reviewingPrestige;
  el('prestige-review').hidden=shop;
  el('insight-shop').hidden=!shop;
  el('prestige-heading').textContent=shop?'Spend Insight · rebuild with a new perspective':`Conclude run ${preview.run}`;
  el('stations').hidden=shop || reviewingPrestige;
  el('journal-section').hidden=shop || reviewingPrestige;
  for (const id of ['pause','advance-10','advance-60']) /** @type {HTMLButtonElement} */(el(id)).disabled=awaitingNewRun || shop || reviewingPrestige;
  el('insight-modifiers').hidden=insight.totalEarned===0;
  el('insight-modifiers').textContent=`${insight.points} unspent Insight · permanent modifiers: ${Object.entries(statNames).map(([stat,name])=>`${name} ×${fmt(insightMultiplier(game,definitions,/** @type {import('../core/types.js').StatId} */(stat)))}`).join(' · ')}`;
  el('prestige-reward').textContent=preview.eligible?`Earn ${preview.award} Insight`:`Prestige reward: ${balance.prestige.baseAward} or more Insight`;
  el('prestige-requirements').textContent=preview.eligible?'Requirements met: nebula frontier researched and at least one grant secured.':preview.blockedReasons.join(' · ');
  el('prestige-payout').textContent=`${balance.prestige.baseAward} base Insight, with diminishing rewards for additional Publications: 2 Publications → ${balance.prestige.baseAward+1}, 5 → ${balance.prestige.baseAward+2}, 10 → ${balance.prestige.baseAward+3}. Your next reward increase is at ${preview.nextPublicationThreshold} Publications.`;
  const loss=preview.losses;
  el('prestige-losses').textContent=`You will lose: ${price(Object.fromEntries(Object.entries(loss.resources).filter(([key,value])=>value>0 || ['D','F','K','I','X'].includes(key))))}; ${loss.purchases} purchased levels, including ${loss.producers} producer purchases; ${loss.stations} station unlocks; ${loss.telescopes} telescopes; ${loss.people} trained people; ${loss.discoveries} journal discoveries; ${loss.publications} Publications and ${loss.grants} grants. Current run time: ${fmt(preview.seconds/60)} minutes.`;
  el('prestige-work-loss').textContent=[loss.course?`Paid course progress ${fmt(loss.course.progress)}/${balance.course.work} will be lost.`:'No course is underway.',loss.program?`Paid study progress ${fmt(loss.program.progress)}/${definitions.programs.find(program=>program.id===loss.program?.id)?.work} will be lost.`:'No study is underway.'].join(' ');
  const confirm=/** @type {HTMLButtonElement} */(el('confirm-prestige'));
  confirm.disabled=awaitingNewRun || !preview.eligible; confirm.textContent=`Reset everything & earn ${preview.award} Insight`;
  el('insight-wallet').textContent=`${insight.points} Insight available · +${insight.lastAward} earned from the previous run`;
  el('insight-shop-info').textContent=`Run ${game.state.clock.campaignIndex-1} has ended and all ordinary progress has reset. Choose modifiers, or keep your points, then begin run ${game.state.clock.campaignIndex}. Production stays paused here.`;
  el('start-next-run').textContent=`Begin run ${game.state.clock.campaignIndex}`;
  for (const upgrade of definitions.insightUpgrades) {
    const level=insight.upgrades[upgrade.id]??0;
    const quote=quoteCommand(game,definitions,balance,{type:'buyInsightUpgrade',upgradeId:upgrade.id});
    const button=/** @type {HTMLButtonElement} */(q(document,`[data-buy-insight="${upgrade.id}"]`));
    button.disabled=awaitingNewRun || !quote.ok;
    button.textContent=level>=upgrade.maxLevel?'Fully purchased':`Buy level ${level+1} · ${price(quote.costs)}`;
    q(document,`[data-insight-effect="${upgrade.id}"]`).textContent=`Level ${level}/${upgrade.maxLevel} · ${upgrade.stats.map(stat=>{
      const current=insightMultiplier(game,definitions,stat);return `${statNames[stat]} ×${fmt(current)} → ×${fmt(current*upgrade.factor)}`;
    }).join(' · ')}${shop && !quote.ok && level<upgrade.maxLevel?' · '+quote.blockedReasons.join(' · '):''}`;
  }
}

function render() {
  const summary=getSummary(game,definitions,balance);
  const minutes=Math.floor(summary.seconds/60);
  el('clock').textContent=`${String(minutes).padStart(2,'0')}:${String(Math.floor(summary.seconds%60)).padStart(2,'0')}`;
  el('runtime-status').textContent=awaitingNewRun?'Previous save protected':game.state.insight.phase==='shop'?'Between runs · Insight shop':running?`Live · ${speed}×`:'Paused';
  el('pause').textContent=running?'Pause':'Run';
  /** @type {Array<[string,number,string]>} */
  const balances=[['Data',game.state.resources.D,`+${fmt(summary.rates.D??0)}/s`],['Knowledge',game.state.resources.K,`+${fmt(summary.rates.K??0)}/s`]];
  if (hasPrerequisite(game,'outreach')) balances.push(['Interest',game.state.resources.I,`+${fmt(summary.rates.I??0)}/s`]);
  if (hasPrerequisite(game,'support-office')) balances.push(['Funding',game.state.resources.F,`+${fmt(summary.rates.F??0)}/s`]);
  if (hasPrerequisite(game,'academy')) balances.push(['Unassigned people',summary.population.available,`${summary.population.total} trained · ${summary.population.appointed} appointed`]);
  if (hasPrerequisite(game,'research')) balances.push(['Expertise',game.state.resources.X,`+${fmt(summary.rates.X??0)}/s`]);
  if (hasPrerequisite(game,'photometry')) balances.push(['Publications',game.state.science.publications,`${summary.grants.active} / ${summary.grants.capacity} grants`]);
  el('balances').replaceChildren(...balances.map(([name,value,note]) => {
    const node=document.createElement('div'); node.className='balance';
    const label=document.createElement('span'); label.textContent=name;
    const count=document.createElement('strong'); count.textContent=fmt(value);
    const help=document.createElement('small'); help.textContent=note;
    node.append(label,count,help); return node;
  }));
  el('objective').textContent=summary.guidance.objective;
  el('suggestion').textContent=summary.guidance.suggestion;
  for (const station of summary.stations) {
    const node=el(`station-${station.id}`); node.hidden=!station.visible;
    const body=/** @type {HTMLElement} */(q(node,'.station-body')); body.hidden=!station.open;
    const income=q(node,'.station-income');
    let amount=0; let rate=0; let caption=station.output;
    if (station.id==='observatory') { amount=game.state.resources.D; rate=summary.rates.D??0; }
    else if (station.id==='science') { amount=game.state.science.publications; rate=summary.rates.science??0; }
    else if (station.id==='academy') { amount=summary.population.available; rate=summary.rates.training??0; caption=summary.population.available===1?'unassigned person':'unassigned people'; }
    else {
      const key=/** @type {import('../core/types.js').StockId} */(({analysis:'K',outreach:'I',support:'F',research:'X'})[station.id]);
      amount=game.state.resources[key]; rate=summary.rates[key]??0;
    }
    q(income,'strong').textContent=fmt(amount); q(income,'span').textContent=caption;
    q(income,'small').textContent=station.id==='science'?`${fmt(rate)} study work/s · ${summary.program?'study underway':'ready for a paid study'}`:station.id==='academy'?`${fmt(rate)} teaching work/s · ${summary.population.total} total trained`:`+${fmt(rate)}/s passive`;
  }
  for (const action of definitions.actions) {
    const button=/** @type {HTMLButtonElement} */(q(document,`[data-action="${action.id}"]`));
    const visible=meets(action.requires);
    button.hidden=!visible;
    const help=/** @type {HTMLElement} */(q(document,`[data-action-help="${action.id}"]`)); help.hidden=!visible;
    button.disabled=awaitingNewRun || Boolean(action.output.training && !game.state.course || action.output.science && !game.state.science.program);
    const output=scaledOutput(game,definitions,action.output);
    q(button,'span').textContent=Object.entries(output).map(([key,value])=>`+${fmt(value)} ${key==='training'?'course work':key==='science'?'study work':currencyName(definitions,key)}`).join(', ');
    help.textContent=action.output.training && !game.state.course?'Enroll a prepaid course to begin. Existing staff keep working.':action.output.science && !game.state.science.program?'Start a prepaid study below. Each completed sample publishes once.':`Hold for up to ${Object.entries(output).map(([key,value])=>`${fmt(value*4)} ${key==='training' || key==='science'?'work':currencyName(definitions,key)}/s`).join(', ')} extra. Passive stations keep running.`;
  }
  for (const item of definitions.investments) {
    const row=/** @type {HTMLElement} */(q(document,`[data-investment="${item.id}"]`));
    const count=getPurchaseCount(game,item.id); const complete=count>=item.maxLevel;
    row.hidden=!meets(item.requires) && count===0;
    row.classList.toggle('complete',complete);
    q(row,'.owned').textContent=complete?(item.kind==='discovery'?'✓ Researched':'✓ Installed'):count?`${count} ${item.kind==='appointment'?'appointed':'owned'}`:'';
    const quote=quoteCommand(game,definitions,balance,{type:'buyInvestment',investmentId:item.id});
    const button=/** @type {HTMLButtonElement} */(q(row,'button'));
    button.disabled=awaitingNewRun || !quote.ok;
    q(button,'small').textContent=price(quote.costs);
    q(row,'.blocked').textContent=quote.ok?'':quote.blockedReasons.join(' · ');
    button.setAttribute('aria-label',`${item.name} · ${price(quote.costs)}`);
    const gain=previewInvestment(game,definitions,balance,item.id);
    const parts=Object.entries(gain.passive).map(([key,value])=>`+${fmt(value)} ${key==='training'?'teaching work':key==='science'?'study work':currencyName(definitions,key)}/s`);
    if (gain.activeGain>1e-9) parts.push(`${gain.actionName}: +${fmt(gain.activeGain)} more/action`);
    if (gain.analysisGain>1e-9) parts.push(`Analyze 10: +${fmt(gain.analysisGain)} more Knowledge`);
    q(row,'.purchase-gain').textContent=parts.length?`This purchase: ${parts.join(' · ')}`:'';
  }
  el('observing-breakdown').textContent=`Frontier: ${summary.frontier.name} ×${fmt(summary.frontier.yield)} · ${fmt(summary.observing.capacity)} installed capacity × ${fmt(summary.observing.bonus)} production bonus = ${fmt(summary.rates.D??0)} Data/s.`;
  el('observing-owned').textContent=`${summary.observing.telescopes} telescope${summary.observing.telescopes===1?'':'s'} retained · ${getPurchaseCount(game,'additional-telescope')} additional · ${getPurchaseCount(game,'appoint-observer')} observers · ${hasPrerequisite(game,'reflector')?'reflector installed':'founding backyard setup'}.`;
  el('analysis-yield').textContent=`One Data balance: ${fmt(game.state.resources.D)} available. Instant yield: ${fmt(analysisYield(game,definitions,balance))} Knowledge/Data.`;
  document.querySelectorAll('[data-process]').forEach(node=>{
    const button=/** @type {HTMLButtonElement} */(node);
    const quantity=button.dataset.process==='all'?game.state.resources.D:10;
    button.textContent=`Analyze ${button.dataset.process==='all'?'all':'10 Data'} → ${fmt(quantity*analysisYield(game,definitions,balance))} Knowledge now`;
    button.disabled=awaitingNewRun || !quoteCommand(game,definitions,balance,{type:'processData',quantity}).ok;
  });
  for (const program of definitions.programs) {
    const button=/** @type {HTMLButtonElement} */(q(document,`[data-start-program="${program.id}"]`));
    const quote=quoteCommand(game,definitions,balance,{type:'startProgram',programId:program.id});
    const active=summary.program?.id===program.id?summary.program:null;
    button.disabled=awaitingNewRun || !quote.ok;
    button.textContent=active?'Study underway':`Start study · ${price(quote.costs)}`;
    const progress=/** @type {HTMLProgressElement} */(q(document,`[data-program-progress="${program.id}"]`));
    progress.hidden=!active; progress.value=active?.progress??0;
    q(document,`[data-program-status="${program.id}"]`).textContent=active?`${fmt(active.progress)} / ${active.required} work · ${fmt((active.required-active.progress)/active.rate)} s at passive speed · fully paid`:
      quote.ok?'Ready to start. Completed studies publish automatically.':quote.blockedReasons.join(' · ');
  }
  el('grant-status').hidden=!hasPrerequisite(game,'first-publication');
  el('grant-status').textContent=`${summary.grants.active} / ${summary.grants.capacity} Publication-backed grants · ${summary.grants.capacity-summary.grants.active} available slots. Each completed study opens one more slot. Publications are not spent; grants have no upkeep.`;
  const enroll=/** @type {HTMLButtonElement} */(el('enroll'));
  const enrollment=quoteCommand(game,definitions,balance,{type:'enrollCourse'});
  enroll.disabled=awaitingNewRun || !enrollment.ok; enroll.textContent=summary.course?'Course underway':`Enroll one · ${price(enrollment.costs)}`;
  const progress=/** @type {HTMLProgressElement} */(el('course-progress')); progress.hidden=!summary.course; progress.value=summary.course?.progress??0;
  el('course-status').textContent=summary.course?`${fmt(summary.course.progress)} / ${summary.course.required} work · ${fmt(Math.max(0,summary.course.required-summary.course.progress)/summary.course.rate)} s at passive teaching speed · fully paid`:enrollment.ok?'Ready to enroll. Appointments stay at their stations.':enrollment.blockedReasons.join(' · ');
  const limits=summary.academy;
  el('course-limit').textContent=limits.teachingLimited
    ?`At passive income, teaching is the limit: ${fmt(limits.courseSeconds)} s/course versus ${fmt(limits.supplySeconds)} s to replace enrollment costs. A teacher can speed future recruitment.`
    :`At passive income, ${currencyName(definitions,limits.limitingCurrency)} is the enrollment limit${Number.isFinite(limits.supplySeconds)?` (${fmt(limits.supplySeconds)} s to replace costs; ${fmt(limits.courseSeconds)} s to teach)`:': no passive income yet'}. Grow that station before adding more teachers. Current savings and active help can cover the gap.`;
  el('journal').replaceChildren(...(game.state.journal.length?game.state.journal.map(id => {
    const node=document.createElement('li'); node.textContent=definitions.targets.find(target => target.id===id)?.claim??id; return node;
  }):[Object.assign(document.createElement('li'),{textContent:'New research discoveries will appear here.'})]));
  el('events').replaceChildren(...recentEvents.map(event => { const node=document.createElement('li'); node.textContent=event.detail; return node; }));
  renderPrestige();
}

el('pause').addEventListener('click',() => { if (awaitingNewRun || reviewingPrestige || game.state.insight.phase==='shop') return; stopHold(); running=!running; accumulator=0; persist(); render(); });
document.querySelectorAll('[data-speed]').forEach(node => node.addEventListener('click',() => {
  speed=Number(/** @type {HTMLElement} */(node).dataset.speed);
  document.querySelectorAll('[data-speed]').forEach(button => button.setAttribute('aria-pressed',String(Number(/** @type {HTMLElement} */(button).dataset.speed)===speed)));
  render();
}));
for (const seconds of [10,60]) el(`advance-${seconds}`).addEventListener('click',() => { stopHold(); advance(seconds/TICK_SECONDS); persist(); render(); });
el('review-prestige').addEventListener('click',()=>{
  stopHold(); resumeAfterReview=running; running=false; accumulator=0; reviewingPrestige=true; persist(); render(); el('prestige-panel').scrollIntoView({block:'start'});
});
el('keep-run').addEventListener('click',()=>{reviewingPrestige=false; running=resumeAfterReview; accumulator=0; render();});
el('confirm-prestige').addEventListener('click',()=>send({type:'beginPrestige'}));
el('export-before-prestige').addEventListener('click',()=>exportGame(game));
el('start-next-run').addEventListener('click',()=>{send({type:'startNextRun'});el('stations').scrollIntoView({block:'start'});});
el('export').addEventListener('click',() => { if (awaitingNewRun) downloadSave(oldSave,'eyes-on-the-universe-previous-save.json'); else exportGame(game); });
el('export-old').addEventListener('click',() => downloadSave(oldSave,'eyes-on-the-universe-previous-save.json'));
function startNew() {
  stopHold(); game=createGame(); reviewingPrestige=false; running=true; awaitingNewRun=false; saveEnabled=true; recentEvents=[]; accumulator=0;
  el('old-save').hidden=true; message('A fresh start. Click or hold Observe, then establish an observing routine.'); persist(); render();
}
el('start-new').addEventListener('click',() => {
  try { if (oldSave) backupPreviousSave(oldSave); } catch { /* Export remains available from the notice. */ }
  startNew();
});
el('restart').addEventListener('click',() => { if (confirm('Erase this prototype, including all permanent Insight upgrades and points? Export first to keep a copy.')) startNew(); });
el('import').addEventListener('change',async () => {
  const input=/** @type {HTMLInputElement} */(el('import')); const file=input.files?.[0]; if (!file) return;
  try {
    const candidate=deserializeGame(await file.text());
    if (awaitingNewRun && oldSave) backupPreviousSave(oldSave);
    stopHold(); game=candidate; reviewingPrestige=false; running=false; accumulator=0; saveEnabled=true; awaitingNewRun=false; recentEvents=[]; el('old-save').hidden=true;
    message(game.state.insight.phase==='shop'?'Insight shop imported. Choose modifiers, then begin the next run.':'Station save imported. Press Run to continue.'); persist(); render();
  } catch (error) { message(`Import left your current run unchanged: ${error instanceof Error?error.message:error}`,true); }
  input.value='';
});
window.addEventListener('blur',stopHold);
document.addEventListener('visibilitychange',() => { if (document.hidden) { stopHold(); running=false; accumulator=0; persist(); render(); } });
window.addEventListener('pagehide',() => { stopHold(); persist(); });
function frame(now=performance.now()) {
  const elapsed=Math.min(.25,(now-lastFrame)/1000); lastFrame=now;
  if (running && !reviewingPrestige && game.state.insight.phase==='playing' && !document.hidden && !awaitingNewRun) {
    accumulator+=elapsed*speed;
    const ticks=Math.floor(accumulator/TICK_SECONDS);
    if (ticks>0) { advance(ticks); accumulator-=ticks*TICK_SECONDS; }
  }
  if (now-lastRender>=120) { render(); lastRender=now; }
  if (now-lastSave>=5000) persist();
  requestAnimationFrame(frame);
}
render(); requestAnimationFrame(frame);
