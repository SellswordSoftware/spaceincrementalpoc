import { getPurchaseCount, hasPrerequisite } from './rates.js';

/** Availability describes new capabilities, independent of wallet balances.
 * @param {import('./types.js').GameState} game @param {import('./types.js').Definitions} definitions */
export function availableInvestments(game,definitions) {
  if (game.state.insight.phase==='shop') return [];
  return definitions.investments.filter(item=>item.requires.every(id=>hasPrerequisite(game,id))
    && game.state.science.publications+1e-9>=(item.publications??0) && getPurchaseCount(game,item.id)<item.maxLevel);
}
/** @param {import('./types.js').GameState} game @param {import('./types.js').Definitions} definitions */
export function newOptions(game,definitions) {
  return availableInvestments(game,definitions).filter(item=>!getPurchaseCount(game,item.id) && !game.state.reviewedOptions.includes(item.id));
}
/** @param {string[]} before @param {import('./types.js').GameState} game @param {import('./types.js').Definitions} definitions @param {string} [source]
 * @returns {import('./types.js').GameEvent[]} */
export function unlockEvents(before,game,definitions,source) {
  return availableInvestments(game,definitions).filter(item=>!before.includes(item.id) && !getPurchaseCount(game,item.id)).map(item=>({
    tick:game.state.clock.tick,type:'unlock',id:item.id,
    detail:`${source?source+' unlocked': 'Now available:'} ${item.name} in ${definitions.stations.find(station=>station.id===item.station)?.name}.`,
  }));
}
/** All grant tiers draw on the same cumulative publication record.
 * @param {import('./types.js').GameState} game @param {import('./types.js').Definitions} definitions */
export function grantCount(game,definitions) {
  return definitions.investments.filter(item=>item.grant).reduce((total,item)=>total+getPurchaseCount(game,item.id),0);
}
