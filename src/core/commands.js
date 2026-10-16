import { getPurchaseCount, hasPrerequisite, prerequisiteName, analysisYield, scaledOutput } from './rates.js';
import { previewPrestige, insightPrice, concludeRun } from './prestige.js';
import { populationSummary } from './people.js';

/** @typedef {import('./types.js').GameState} GameState */
/** @typedef {import('./types.js').Definitions} Definitions */
/** @typedef {import('./types.js').Balance} Balance */
/** @typedef {import('./types.js').Command} Command */
/** @param {GameState} game @param {Definitions} definitions @param {string} key */
export function wallet(game, definitions, key) {
  if (key==='Insight') return game.state.insight.points;
  if (key === 'N') return populationSummary(game,definitions).available;
  return game.state.resources[/** @type {import('./types.js').StockId} */ (key)] ?? 0;
}

/** @param {GameState} game @param {Definitions} definitions @param {Balance} balance @param {Command} command
 * @returns {import('./types.js').CommandQuote}
 */
export function quoteCommand(game, definitions, balance, command) {
  /** @type {import('./types.js').Costs} */
  let costs = {};
  /** @type {string[]} */
  const blockedReasons = [];
  /** @param {string[]} ids */
  function require(ids) {
    for (const id of ids) if (!hasPrerequisite(game,id)) blockedReasons.push(`Requires ${prerequisiteName(definitions,id)}`);
  }
  const transition=command.type==='beginPrestige' || command.type==='buyInsightUpgrade' || command.type==='startNextRun';
  if (!transition && game.state.insight.phase==='shop') blockedReasons.push('Begin the next run before using stations');
  switch (command.type) {
    case 'beginPrestige':
      blockedReasons.push(...previewPrestige(game,definitions,balance).blockedReasons);
      break;
    case 'buyInsightUpgrade': {
      if (game.state.insight.phase!=='shop') blockedReasons.push('Insight upgrades are bought between runs');
      const upgrade=definitions.insightUpgrades.find(item=>item.id===command.upgradeId);
      if (!upgrade) { blockedReasons.push('Unknown Insight upgrade'); break; }
      if ((game.state.insight.upgrades[upgrade.id]??0)>=upgrade.maxLevel) blockedReasons.push('Fully purchased');
      costs={Insight:insightPrice(game,upgrade)};
      break;
    }
    case 'startNextRun':
      if (game.state.insight.phase!=='shop') blockedReasons.push('No new run is waiting to begin');
      break;
    case 'buyInvestment': {
      const item = definitions.investments.find(item => item.id === command.investmentId);
      if (!item) { blockedReasons.push('Unknown purchase'); break; }
      const count = getPurchaseCount(game,item.id);
      require(item.requires);
      if (item.id==='observing-grant' && count>=game.state.science.publications) blockedReasons.push('Publish another study to open another grant slot');
      if (count >= item.maxLevel) blockedReasons.push('Fully purchased');
      for (const [key,base] of Object.entries(item.cost)) {
        const precision=key==='X'?100:1;
        costs[/** @type {import('./types.js').CurrencyId} */(key)]=Math.ceil(base*item.growth**count*precision-1e-9)/precision;
      }
      break;
    }
    case 'processData': {
      require(['analysis-tools']);
      if (!Number.isFinite(command.quantity) || command.quantity <= 0) blockedReasons.push('No Data to process');
      else costs.D = command.quantity;
      break;
    }
    case 'performStationAction': {
      const action = definitions.actions.find(item => item.id === command.actionId);
      if (!action) { blockedReasons.push('Unknown station action'); break; }
      require(action.requires);
      if (game.state.clock.tick < game.state.nextActionTick) blockedReasons.push('Action is cooling down');
      if (action.output.training && !game.state.course) blockedReasons.push('Enroll a course first');
      if (action.output.science && !game.state.science.program) blockedReasons.push('Start a scientific study first');
      break;
    }
    case 'startProgram': {
      const program=definitions.programs.find(item=>item.id===command.programId);
      if (!program) { blockedReasons.push('Unknown scientific program'); break; }
      require(program.requires);
      if (game.state.science.program) blockedReasons.push('A scientific study is already underway');
      costs={...program.cost};
      break;
    }
    case 'enrollCourse':
      require(['academy']);
      if (game.state.course) blockedReasons.push('Course already enrolled');
      costs = {...balance.course.cost};
      break;
    default: blockedReasons.push('Unsupported command');
  }
  for (const [key,cost] of Object.entries(costs)) {
    if (wallet(game,definitions,key)+1e-9 < cost) blockedReasons.push(`Need more ${currencyName(definitions,key)}`);
  }
  return {ok:blockedReasons.length === 0,costs,blockedReasons};
}

/** @param {Definitions} definitions @param {string} key */
export function currencyName(definitions, key) {
  if (key === 'N') return 'unassigned people';
  return definitions.resources.find(item => item.id === key)?.name ?? key;
}

/** @param {GameState} game @param {Definitions} definitions @param {Balance} balance @returns {import('./types.js').GameEvent[]} */
export function completeCourse(game, definitions, balance) {
  if (!game.state.course || game.state.course.progress+1e-9 < balance.course.work) return [];
  game.state.course = null;
  game.state.population.total++;
  return [{tick:game.state.clock.tick,type:'graduate',id:'course',detail:'A graduate is ready for a permanent appointment.'}];
}

/** Course and science rewards occur once, after paid progress completes.
 * @param {GameState} game @param {Definitions} definitions @param {Balance} balance
 * @returns {import('./types.js').GameEvent[]} */
export function completeProjects(game,definitions,balance) {
  const events=completeCourse(game,definitions,balance);
  const active=game.state.science.program;
  const program=definitions.programs.find(item=>item.id===active?.id);
  if (active && program && active.progress+1e-9>=program.work) {
    game.state.science.publications+=program.publications;
    game.state.science.program=null;
    events.push({tick:game.state.clock.tick,type:'publication',id:program.id,detail:`Published a variable-star study. ${game.state.science.publications} Publication(s); another grant slot is available.`});
  }
  return events;
}

/** @param {GameState} game @param {Definitions} definitions @param {import('./types.js').Output} output @param {number} factor */
export function produce(game, definitions, output, factor) {
  for (const [key,amount] of Object.entries(output)) {
    if (key === 'training') { if (game.state.course) game.state.course.progress += amount*factor; }
    else if (key === 'science') { if (game.state.science.program) game.state.science.program.progress+=amount*factor; }
    else game.state.resources[/** @type {import('./types.js').StockId} */(key)] += amount*factor;
  }
}

/** @param {GameState} game @param {Definitions} definitions @param {Balance} balance @param {Command} command
 * @returns {import('./types.js').CommandResult}
 */
export function dispatch(game, definitions, balance, command) {
  const quote = quoteCommand(game,definitions,balance,command);
  if (!quote.ok) return {...quote,events:[]};
  for (const [key,cost] of Object.entries(quote.costs)) {
    if (key==='Insight') game.state.insight.points-=cost;
    else if (key !== 'N') {
      const stock = /** @type {import('./types.js').StockId} */(key);
      game.state.resources[stock] = Math.max(0,game.state.resources[stock]-cost);
    }
  }
  /** @type {import('./types.js').GameEvent[]} */
  const events = [];
  if (command.type==='beginPrestige') {
    const award=concludeRun(game,definitions,balance);
    events.push({tick:0,type:'prestige',id:'insight',detail:`Run concluded. Earned ${award} Insight. All ordinary progress has reset.`});
  } else if (command.type==='buyInsightUpgrade') {
    game.state.insight.upgrades[command.upgradeId]=(game.state.insight.upgrades[command.upgradeId]??0)+1;
    events.push({tick:0,type:'insight',id:command.upgradeId,detail:'Purchased a permanent Insight modifier.'});
  } else if (command.type==='startNextRun') {
    game.state.insight.phase='playing';
    events.push({tick:0,type:'run-started',id:String(game.state.clock.campaignIndex),detail:`Run ${game.state.clock.campaignIndex} begins with permanent Insight modifiers.`});
  } else if (command.type === 'buyInvestment') {
    game.state.purchases[command.investmentId] = getPurchaseCount(game,command.investmentId)+1;
    const item = definitions.investments.find(item => item.id === command.investmentId);
    events.push({tick:game.state.clock.tick,type:'purchase',id:command.investmentId,detail:item?.name ?? command.investmentId});
  } else if (command.type === 'processData') game.state.resources.K += command.quantity*analysisYield(game,definitions,balance);
  else if (command.type === 'enrollCourse') {
    game.state.course = {progress:0};
    events.push({tick:game.state.clock.tick,type:'enrollment',id:'course',detail:'Course paid in full. Teaching continues independently.'});
  } else if (command.type === 'startProgram') {
    game.state.science.program={id:command.programId,progress:0};
    events.push({tick:game.state.clock.tick,type:'program-started',id:command.programId,detail:'Scientific study paid in full. Observing and teaching continue independently.'});
  } else if (command.type === 'performStationAction') {
    const action = definitions.actions.find(item => item.id === command.actionId);
    if (action) produce(game,definitions,scaledOutput(game,definitions,action.output),1);
    game.state.nextActionTick = game.state.clock.tick+balance.actionCooldownTicks;
    events.push(...completeProjects(game,definitions,balance));
  }
  if (command.type === 'buyInvestment') {
    const target=definitions.targets.find(target=>target.investmentId===command.investmentId);
    if (target && !game.state.journal.includes(target.id)) {
      game.state.journal.push(target.id);
      events.push({tick:game.state.clock.tick,type:'record',id:target.id,detail:target.claim});
    }
  }
  return {...quote,events};
}
