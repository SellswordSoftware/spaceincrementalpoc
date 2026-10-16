/** @typedef {import('./types.js').GameState} GameState */
/** @typedef {import('./types.js').Definitions} Definitions */

/** @param {GameState} game @param {string} id */
export function getPurchaseCount(game,id) { return game.state.purchases[id] ?? 0; }
/** @param {GameState} game @param {string} id */
export function hasPrerequisite(game,id) {
  if (id==='first-publication') return game.state.science.publications>0;
  return id==='first-graduate'?game.state.population.total>0:getPurchaseCount(game,id)>0;
}
/** @param {Definitions} definitions @param {string} id */
export function prerequisiteName(definitions,id) { return definitions.investments.find(item=>item.id===id)?.name ?? (id==='first-graduate'?'first graduate':id==='first-publication'?'first Publication':id); }
/** Permanent Insight factors multiply the ordinary run's local bonuses.
 * @param {GameState} game @param {Definitions} definitions @param {import('./types.js').StatId} stat */
export function insightMultiplier(game,definitions,stat) {
  return definitions.insightUpgrades.reduce((factor,item)=>factor*(item.stats.includes(stat)?item.factor**(game.state.insight.upgrades[item.id]??0):1),1);
}
/** @param {GameState} game @param {Definitions} definitions @param {import('./types.js').StatId} stat */
export function multiplier(game,definitions,stat) {
  return insightMultiplier(game,definitions,stat)*(1+definitions.investments.reduce((sum,item)=>sum+(item.boost?.stat===stat?item.boost.bonus*getPurchaseCount(game,item.id):0),0));
}
/** @param {GameState} game @param {Definitions} definitions */
export function observingFrontier(game,definitions) {
  return definitions.targets.filter(target=>!target.investmentId || hasPrerequisite(game,target.investmentId))
    .reduce((best,target)=>target.yield>best.yield?target:best,definitions.targets[0]);
}
/** @param {string} output @returns {import('./types.js').StatId} */
export function outputStat(output) {
  return output==='D'?'observing':output==='K'?'analysis':output==='I'?'outreach':output==='F'?'support':output==='training'?'teaching':output==='science'?'science':'research';
}
/** @param {GameState} game @param {Definitions} definitions @param {string} output */
export function outputMultiplier(game,definitions,output) {
  return multiplier(game,definitions,outputStat(output))*(output==='D'?observingFrontier(game,definitions).yield:1);
}
/** @param {GameState} game @param {Definitions} definitions @param {import('./types.js').Output} base
 * @returns {import('./types.js').Output} */
export function scaledOutput(game,definitions,base) {
  return Object.fromEntries(Object.entries(base).map(([key,value])=>[key,value*outputMultiplier(game,definitions,key)]));
}
/** @param {GameState} game @param {Definitions} definitions @param {import('./types.js').Balance} balance */
export function analysisYield(game,definitions,balance) { return balance.knowledgePerData*multiplier(game,definitions,'analysis'); }
/** @param {GameState} game @param {Definitions} definitions @param {import('./types.js').Balance} balance
 * @returns {import('./types.js').Output} */
export function baseProduction(game,definitions,balance) {
  /** @type {import('./types.js').Output} */
  const output={};
  if (hasPrerequisite(game,'photometry')) output.science=balance.programRate;
  if (hasPrerequisite(game,'academy')) output.training=balance.course.baseRate;
  for (const item of definitions.investments) for (const [key,value] of Object.entries(item.output)) {
    const currency=/** @type {keyof import('./types.js').Output} */(key);
    output[currency]=(output[currency]??0)+value*getPurchaseCount(game,item.id);
  }
  return output;
}
/** Installed producers never depend on a recurring wallet input.
 * @param {GameState} game @param {Definitions} definitions @param {import('./types.js').Balance} balance */
export function productionRates(game,definitions,balance) { return scaledOutput(game,definitions,baseProduction(game,definitions,balance)); }
/** Read-only marginal rate preview; never temporarily mutates the live game.
 * @param {GameState} game @param {Definitions} definitions @param {import('./types.js').Balance} balance @param {string} investmentId */
export function previewInvestment(game,definitions,balance,investmentId) {
  const candidate={...game,state:{...game.state,purchases:{...game.state.purchases,[investmentId]:getPurchaseCount(game,investmentId)+1}}};
  const before=productionRates(game,definitions,balance), after=productionRates(candidate,definitions,balance);
  /** @type {import('./types.js').Output} */
  const passive={};
  for (const key of Object.keys(after)) {
    const currency=/** @type {keyof import('./types.js').Output} */(key);
    const gain=(after[currency]??0)-(before[currency]??0);
    if (gain>1e-9) passive[currency]=gain;
  }
  const action=definitions.actions.find(action=>action.station===definitions.investments.find(item=>item.id===investmentId)?.station);
  // Cross-station practice improvements also preview the relevant active action.
  const stat=definitions.investments.find(item=>item.id===investmentId)?.boost?.stat;
  const discovery=definitions.targets.some(target=>target.investmentId===investmentId);
  const relevantAction=discovery?definitions.actions.find(action=>action.id==='observe'):stat?definitions.actions.find(action=>Object.keys(action.output).some(key=>outputStat(key)===stat)):action;
  let activeGain=0;
  if (relevantAction) {
    const key=Object.keys(relevantAction.output)[0];
    const amount=Object.values(relevantAction.output)[0];
    activeGain=amount*(outputMultiplier(candidate,definitions,key)-outputMultiplier(game,definitions,key));
  }
  return {passive,actionName:relevantAction?.name??'',activeGain,analysisGain:10*(analysisYield(candidate,definitions,balance)-analysisYield(game,definitions,balance))};
}
