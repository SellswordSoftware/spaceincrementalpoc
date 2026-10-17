import { productionRates, baseProduction, hasPrerequisite, observingFrontier, multiplier, facilitySummary } from './rates.js';
import { populationSummary } from './people.js';
import { previewPrestige } from './prestige.js';
import { TICK_SECONDS } from './versions.js';

/** Actual unlocks are separate from optional investment suggestions.
 * @param {import('./types.js').GameState} game @param {import('./types.js').Definitions} definitions @param {import('./types.js').Balance} balance */
export function getGuidance(game,definitions,balance) {
  if (game.state.insight.phase==='shop') return {nextId:null,objective:`Spend Insight, then begin run ${game.state.clock.campaignIndex}.`,suggestion:'Permanent modifiers carry into every future run. Unspent points can be saved for your next prestige.'};
  const path=['observing-routine','analysis-tools','outreach','support-office','target-jupiter','stable-mount','tracking','engineering','target-saturn','reflector','permanent-enclosure','camera','target-star-clusters','academy','first-graduate','research','robotic-dome','photometry','first-publication','grant-office','observing-grant','target-nebulae','expanded-observatory','target-galaxies','mountain-telescope','target-galaxy-clusters','radio-observatory','target-radio-sources','space-program','orbital-platform','orbital-payload','orbital-commissioning','target-transit-targets','orbital-result','infrared-program','infrared-mirror','infrared-shield','infrared-commissioning','target-infrared-fields','infrared-result','target-deep-field','joint-science','radio-timing','joint-changing-sky','orbital-monitoring','spectrograph','stellar-spectroscopy','joint-planetary-systems','joint-deep-time','joint-result-changing-sky','joint-result-planetary-systems','joint-result-deep-time','network-synthesis'];
  const nextId=path.find(id=>!hasPrerequisite(game,id));
  const next=definitions.investments.find(item=>item.id===nextId);
  const objective=game.state.joint.completedAtTick!==null?'Eyes on the Universe complete. Keep observing, or prestige to rebuild with Insight.'
    :game.state.joint.finaleProgress!==null?'The final network synthesis is underway. All stations keep working while its 90-second timer completes.'
    :nextId?.startsWith('joint-result-')?'Joint programs repeat automatically. Each must return a result before the final synthesis can begin.'
    :nextId==='orbital-result'?'The first orbital telescope is observing automatically. Its first 60-second science cycle opens the infrared flagship program.'
    :nextId==='infrared-result'?'The infrared flagship is surveying automatically. Its first 60-second cycle enables early-galaxy deep-field research.'
    :nextId==='first-publication'?'The research teams publish automatically every 60 seconds. Publications open grants.'
    :nextId==='first-graduate'?'The founding classroom graduates automatically after 40 seconds. The first graduate reveals Research.'
    :next?`${next.name}. ${next.effect}`:'The connected network is ready for its final synthesis.';
  let suggestion='Hold Observe for extra Data. Purchased production continues when you help elsewhere.';
  if (hasPrerequisite(game,'analysis-tools')) suggestion='Analyze Data for Knowledge now, or expand archive research for permanent income. Both are valid routes.';
  if (next?.cost.F) suggestion='Supporter groups and extra telescopes are optional growth investments. Contact supporters can also help fund the next unlock.';
  if (next?.cost.E) suggestion='Add engineering benches or permanently appoint engineers to build Engineering Progress. Existing stations keep producing.';
  if (!nextId) suggestion=hasPrerequisite(game,'target-nebulae')?'Expand whichever station limits your next investment. Every appointment is permanent.':'Optional discovery: research nebula imaging to raise network Data yield to ×8.';
  const people=populationSummary(game,definitions);
  if (people.available>0 && !next?.cost.E) suggestion=`${people.available} unassigned graduate${people.available===1?'':'s'} can join any eligible station. No particular appointment is required to progress.`;
  if (hasPrerequisite(game,'robotic-dome') && !hasPrerequisite(game,'stellar-spectroscopy')) suggestion='Optional science branch: develop a spectrograph in Engineering, then stellar spectroscopy to increase Publication rewards without shortening the timers.';
  return {nextId:nextId??null,objective,suggestion};
}
/** @param {import('./types.js').GameState} game @param {import('./types.js').Definitions} definitions @param {import('./types.js').Balance} balance */
export function getSummary(game,definitions,balance) {
  const rates=productionRates(game,definitions,balance);
  const branches=Object.fromEntries(['radio','space'].map(station=>{
    const capacity=definitions.investments.filter(item=>item.station===station).reduce((sum,item)=>sum+(item.output.D??0)*(game.state.purchases[item.id]??0),0);
    return [station,{capacity,rate:capacity*observingFrontier(game,definitions).yield*multiplier(game,definitions,'observing')}];
  }));
  return {joint:{...game.state.joint,programs:definitions.jointPrograms.map(program=>({...program,state:game.state.joint.programs[program.id]??null,creditReward:program.credits*multiplier(game,definitions,'collaboration'),publicationReward:program.publications*multiplier(game,definitions,'science')})),finale:definitions.finale},branches,missions:definitions.missions.map(mission=>({...mission,state:game.state.missions[mission.id]??null,reward:mission.publications*multiplier(game,definitions,'science')})),prestige:previewPrestige(game,definitions,balance),
    science:{...game.state.science,seconds:definitions.programs[0].work,reward:multiplier(game,definitions,'science')*definitions.programs[0].publications},
    academy:{...game.state.academy,seconds:balance.course.seconds,reward:multiplier(game,definitions,'teaching')},
    grants:{active:game.state.purchases['observing-grant']??0,capacity:game.state.science.publications},
    seconds:game.state.clock.tick*TICK_SECONDS,rates,population:populationSummary(game,definitions),frontier:observingFrontier(game,definitions),
    observing:{...facilitySummary(game,definitions),capacity:baseProduction(game,definitions,balance).D??0,bonus:multiplier(game,definitions,'observing')},
    guidance:getGuidance(game,definitions,balance),
    stations:definitions.stations.map(station=>({...station,visible:station.reveal.every(id=>hasPrerequisite(game,id)),open:station.requires.every(id=>hasPrerequisite(game,id))}))};
}
