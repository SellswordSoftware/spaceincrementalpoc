import { productionRates, baseProduction, hasPrerequisite, observingFrontier, multiplier } from './rates.js';
import { populationSummary } from './people.js';
import { previewPrestige } from './prestige.js';
import { TICK_SECONDS } from './versions.js';

/** @param {import('./types.js').GameState} game @param {import('./types.js').Definitions} definitions @param {import('./types.js').Balance} balance */
export function academyLimits(game,definitions,balance) {
  const rates=productionRates(game,definitions,balance);
  const supply=Object.entries(balance.course.cost).map(([currency,cost])=>({currency,seconds:cost/(rates[/** @type {import('./types.js').StockId} */(currency)]??0)}))
    .sort((a,b)=>b.seconds-a.seconds)[0];
  const courseSeconds=balance.course.work/(rates.training??0);
  return {courseSeconds,supplySeconds:supply.seconds,limitingCurrency:supply.currency,teachingLimited:courseSeconds>supply.seconds+1e-9};
}
/** Actual unlocks are separate from optional investment suggestions.
 * @param {import('./types.js').GameState} game @param {import('./types.js').Definitions} definitions @param {import('./types.js').Balance} balance */
export function getGuidance(game,definitions,balance) {
  if (game.state.insight.phase==='shop') return {nextId:null,objective:`Spend Insight, then begin run ${game.state.clock.campaignIndex}.`,suggestion:'Permanent modifiers carry into every future run. Unspent points can be saved for your next prestige.'};
  const path=['observing-routine','analysis-tools','outreach','support-office','target-jupiter','stable-mount','tracking','target-saturn','reflector','camera','target-star-clusters','academy','first-graduate','research','photometry','first-publication','grant-office','observing-grant'];
  const nextId=path.find(id=>!hasPrerequisite(game,id));
  const next=definitions.investments.find(item=>item.id===nextId);
  const objective=nextId==='first-publication'?(game.state.science.program?'Complete the prepaid study to publish your first result and open grants.':'Start a variable-star study in Scientific programs. Pay once; its completion awards a Publication.')
    :nextId==='first-graduate'?(game.state.course?'Finish the prepaid course to reveal the Research institute.':'Enroll and complete one course to reveal the Research institute.')
    :next?`${next.name}. ${next.effect}`:(hasPrerequisite(game,'target-nebulae')?'Prestige is available. Review the full reset and earn Insight to accelerate the next run.':'Research nebula imaging to finish the first prestige requirements.');
  let suggestion='Hold Observe for extra Data. Purchased production continues when you help elsewhere.';
  if (hasPrerequisite(game,'analysis-tools')) suggestion='Analyze Data for Knowledge now, or expand archive research for permanent income. Both are valid routes.';
  if (next?.cost.F) suggestion='Supporter groups and extra telescopes are optional growth investments. Contact supporters can also help fund the next unlock.';
  if (!nextId) suggestion=hasPrerequisite(game,'target-nebulae')?'Expand whichever station limits your next investment. Every appointment is permanent.':'Optional discovery: research nebula imaging to raise network Data yield to ×8.';
  const people=populationSummary(game,definitions);
  if (people.available>0) suggestion=`${people.available} unassigned graduate${people.available===1?'':'s'} can join any eligible station. No particular appointment is required to progress.`;
  return {nextId:nextId??null,objective,suggestion};
}
/** @param {import('./types.js').GameState} game @param {import('./types.js').Definitions} definitions @param {import('./types.js').Balance} balance */
export function getSummary(game,definitions,balance) {
  const rates=productionRates(game,definitions,balance);
  const active=game.state.science.program;
  const definition=definitions.programs.find(item=>item.id===active?.id);
  return {prestige:previewPrestige(game,definitions,balance),program:active && definition?{id:definition.id,name:definition.name,progress:active.progress,required:definition.work,rate:rates.science??0}:null,
    grants:{active:game.state.purchases['observing-grant']??0,capacity:game.state.science.publications},
    seconds:game.state.clock.tick*TICK_SECONDS,rates,population:populationSummary(game,definitions),frontier:observingFrontier(game,definitions),
    observing:{capacity:baseProduction(game,definitions,balance).D??0,bonus:multiplier(game,definitions,'observing'),
      telescopes:1+(game.state.purchases['additional-telescope']??0)+(game.state.purchases.reflector??0)},
    guidance:getGuidance(game,definitions,balance),academy:academyLimits(game,definitions,balance),
    stations:definitions.stations.map(station=>({...station,visible:station.reveal.every(id=>hasPrerequisite(game,id)),open:station.requires.every(id=>hasPrerequisite(game,id))})),
    course:game.state.course?{progress:game.state.course.progress,required:balance.course.work,rate:rates.training??0}:null};
}
