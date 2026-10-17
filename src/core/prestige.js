import { hasPrerequisite, prerequisiteName, getPurchaseCount, facilitySummary } from './rates.js';
import { createRunState } from './state.js';
import { TICK_SECONDS } from './versions.js';

/** @param {import('./types.js').GameState} game @param {import('./types.js').InsightUpgrade} upgrade */
export function insightPrice(game,upgrade) {
  return Math.ceil(upgrade.cost*upgrade.growth**(game.state.insight.upgrades[upgrade.id]??0));
}
/** A live, read-only preview. No rewards are claimed until beginPrestige succeeds.
 * @param {import('./types.js').GameState} game @param {import('./types.js').Definitions} definitions @param {import('./types.js').Balance} balance */
export function previewPrestige(game,definitions,balance) {
  const blockedReasons=balance.prestige.requires.filter(id=>!hasPrerequisite(game,id)).map(id=>`Requires ${prerequisiteName(definitions,id)}`);
  if (game.state.insight.phase!=='playing') blockedReasons.push('Already between runs');
  const publications=game.state.science.publications;
  const extra=Math.floor(Math.sqrt(Math.max(0,publications-1)));
  const potentialAward=balance.prestige.baseAward+extra;
  return {eligible:blockedReasons.length===0,blockedReasons,award:blockedReasons.length?0:potentialAward,potentialAward,
    nextPublicationThreshold:(extra+1)**2+1,run:game.state.clock.campaignIndex,seconds:game.state.clock.tick*TICK_SECONDS,
    losses:{resources:{...game.state.resources},producers:definitions.investments.filter(item=>item.kind==='producer').reduce((sum,item)=>sum+getPurchaseCount(game,item.id),0),
      telescopes:facilitySummary(game,definitions).telescopes,
      stations:definitions.stations.filter(station=>station.requires.length && station.requires.every(id=>hasPrerequisite(game,id))).length,
      purchases:Object.values(game.state.purchases).reduce((sum,count)=>sum+count,0),people:game.state.population.total,
      discoveries:game.state.journal.filter(id=>id!=='moon').length,publications,grants:game.state.purchases['observing-grant']??0,
      joint:structuredClone(game.state.joint),missions:structuredClone(game.state.missions),classrooms:game.state.academy.timers.length,researchTeams:game.state.science.timers.length,
      academy:{timers:[...game.state.academy.timers],remainder:game.state.academy.remainder},
      science:{timers:[...game.state.science.timers],remainder:game.state.science.remainder}},
    retained:{points:game.state.insight.points,upgrades:{...game.state.insight.upgrades}}};
}
/** Caller has checked eligibility atomically in dispatch.
 * @param {import('./types.js').GameState} game @param {import('./types.js').Definitions} definitions @param {import('./types.js').Balance} balance */
export function concludeRun(game,definitions,balance) {
  const preview=previewPrestige(game,definitions,balance);
  const insight={...game.state.insight,points:game.state.insight.points+preview.award,totalEarned:game.state.insight.totalEarned+preview.award,
    upgrades:{...game.state.insight.upgrades},phase:/** @type {const} */('shop'),lastAward:preview.award};
  const modified=game.state.modified;
  game.state=createRunState(balance,game.state.clock.campaignIndex+1,insight);
  game.state.modified=modified;
  return preview.award;
}
