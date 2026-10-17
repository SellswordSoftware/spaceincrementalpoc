import { grantCount, newOptions } from './availability.js';
import { productionRates, baseProduction, hasPrerequisite, observingFrontier, multiplier, facilitySummary } from './rates.js';
import { populationSummary } from './people.js';
import { previewPrestige } from './prestige.js';
import { TICK_SECONDS } from './versions.js';

/** Actual unlocks are separate from optional investment suggestions.
 * @param {import('./types.js').GameState} game @param {import('./types.js').Definitions} definitions @param {import('./types.js').Balance} balance */
export function getGuidance(game,definitions,balance) {
  if (game.state.insight.phase==='shop') return {nextId:null,objective:`Spend Insight, then begin run ${game.state.clock.campaignIndex}.`,suggestion:'Permanent modifiers carry into every future run. Unspent points can be saved for your next prestige.'};
  const path=['observing-routine','analysis-tools','outreach','support-office','target-jupiter','stable-mount','tracking','engineering','target-saturn','reflector','permanent-enclosure','camera','target-star-clusters','academy','first-graduate','research','robotic-dome','photometry','first-publication','grant-office','observing-grant','target-nebulae','advanced-calibration','spectrograph','stellar-spectroscopy','advanced-grants','research-grant','expanded-observatory','target-galaxies','mountain-telescope','target-galaxy-clusters','radio-observatory','radio-timing','target-radio-sources','space-program','orbital-operations','orbital-platform','orbital-payload','orbital-commissioning','orbital-monitoring','target-transit-targets','flagship-grants','flagship-grant','infrared-program','infrared-calibration','infrared-mirror','infrared-shield','infrared-commissioning','target-infrared-fields','joint-science','joint-changing-sky','joint-planetary-systems','target-deep-field','joint-deep-time','network-integration','network-synthesis'];
  const nextId=previewPrestige(game,definitions,balance).encouraged?'expanded-observatory':path.find(id=>!hasPrerequisite(game,id));
  const next=definitions.investments.find(item=>item.id===nextId);
  const objective=game.state.joint.completedAtTick!==null?'Eyes on the Universe complete. Keep observing, or prestige to rebuild with Insight.'
    :nextId==='first-publication'?'Build your first Publication through continuous research. Publications qualify the network for grants and advanced capabilities.'
    :nextId==='first-graduate'?'The founding classroom graduates automatically after 40 seconds. The first graduate reveals Research.'
    :next?`${next.name}. ${next.effect}`:'The connected network is ready for its final synthesis.';
  let suggestion='Hold Observe for extra Data. Purchased production continues when you help elsewhere.';
  if (hasPrerequisite(game,'analysis-tools')) suggestion='Analyze Data for Knowledge now, or expand archive research for permanent income. Both are valid routes.';
  if (next?.cost.F) suggestion='Supporter groups and extra telescopes are optional growth investments. Contact supporters can also help fund the next unlock.';
  if (next?.cost.E) suggestion='Add engineering benches or permanently appoint engineers to build Engineering Progress. Existing stations keep producing.';
  if (!nextId) suggestion=hasPrerequisite(game,'target-nebulae')?'Expand whichever station limits your next investment. Every appointment is permanent.':'Optional discovery: research nebula imaging to raise network Data yield to ×8.';
  const people=populationSummary(game,definitions);
  if (people.available>0 && !next?.cost.E) suggestion=`${people.available} unassigned graduate${people.available===1?'':'s'} can join any eligible station. No particular appointment is required to progress.`;
  if (next?.cost.X) suggestion='Add mentoring or appoint researchers to increase Expertise production for this required method.';
  if ((next?.publications??0)>game.state.science.publications) suggestion=`Requires ${next?.publications} cumulative Publications; your record is never spent. Add research teams, improve scientific practice or coordinate science to increase production.`;
  return {nextId:nextId??null,objective,suggestion};
}
/** @param {import('./types.js').GameState} game @param {import('./types.js').Definitions} definitions @param {import('./types.js').Balance} balance */
export function getSummary(game,definitions,balance) {
  const rates=productionRates(game,definitions,balance);
  const branches=Object.fromEntries(['radio','space'].map(station=>{
    const capacity=definitions.investments.filter(item=>item.station===station).reduce((sum,item)=>sum+(item.output.D??0)*(game.state.purchases[item.id]??0),0);
    return [station,{capacity,rate:capacity*observingFrontier(game,definitions).yield*multiplier(game,definitions,'observing')}];
  }));
  return {newOptions:newOptions(game,definitions),joint:{...game.state.joint,programs:definitions.jointPrograms.map(program=>{
      const teams=game.state.purchases[program.investmentId]??0;
      return {...program,teams,creditRate:program.creditsPerSecond*teams*multiplier(game,definitions,'collaboration'),publicationRate:program.publicationsPerSecond*teams*multiplier(game,definitions,'science')};
    }),finale:definitions.finale},branches,missions:definitions.missions.map(mission=>({...mission,commissioned:hasPrerequisite(game,mission.commissionId),rate:hasPrerequisite(game,mission.commissionId)?mission.publicationsPerSecond*multiplier(game,definitions,'science'):0})),prestige:previewPrestige(game,definitions,balance),
    science:{...game.state.science,teams:hasPrerequisite(game,'photometry')?1+(game.state.purchases['appoint-scientist']??0):0,rate:rates.science??0},
    academy:{...game.state.academy,seconds:balance.course.seconds,reward:multiplier(game,definitions,'teaching')},
    grants:{active:grantCount(game,definitions),capacity:Math.floor(game.state.science.publications+1e-9)},
    seconds:game.state.clock.tick*TICK_SECONDS,rates,population:populationSummary(game,definitions),frontier:observingFrontier(game,definitions),
    observing:{...facilitySummary(game,definitions),capacity:baseProduction(game,definitions,balance).D??0,bonus:multiplier(game,definitions,'observing')},
    guidance:getGuidance(game,definitions,balance),
    stations:definitions.stations.map(station=>({...station,visible:station.reveal.every(id=>hasPrerequisite(game,id)),open:station.requires.every(id=>hasPrerequisite(game,id))}))};
}
