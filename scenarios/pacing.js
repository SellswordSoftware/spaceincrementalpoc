import { advanceTicks, balance, createGame, definitions, dispatch, getSummary, quoteCommand, TICK_SECONDS, serializeGame } from '../src/core/index.js';
import { analysisYield, scaledOutput } from '../src/core/rates.js';

/** Deliberately attentive play: convert only needed Data and assist the largest deficit.
 * Fixed purchases include reinvestment, unlike the mostly passive historical scenario.
 * This is a reproducible reference policy, not a bound on optimal human play.
 * @param {import('../src/core/types.js').GameState} [game] */
export function runPacingOpening(game=createGame()) {
  /** @type {Record<string,number>} */
  const milestones={};
  /** @param {string} investmentId */
  function buy(investmentId) {
    const command=/** @type {const} */({type:'buyInvestment',investmentId});
    const deadline=game.state.clock.tick+240000;
    let quote=quoteCommand(game,definitions,balance,command);
    while (!quote.ok) {
      if (game.state.clock.tick>=deadline) throw new Error(`Active progression stalled at ${investmentId}: ${quote.blockedReasons.join('; ')}`);
      const needed=Math.max(0,(quote.costs.K??0)-game.state.resources.K);
      const quantity=Math.min(Math.max(0,game.state.resources.D-(quote.costs.D??0)),needed/analysisYield(game,definitions,balance));
      if (quantity>1e-9 && game.state.purchases['analysis-tools']) dispatch(game,definitions,balance,{type:'processData',quantity});
      const rates=getSummary(game,definitions,balance).rates;
      let longest=0;
      let actionId='';
      for (const action of definitions.actions) {
        const actionCommand=/** @type {const} */({type:'performStationAction',actionId:action.id});
        if (!quoteCommand(game,definitions,balance,actionCommand).ok) continue;
        const output=scaledOutput(game,definitions,action.output);
        for (const [key,yieldPerClick] of Object.entries(output)) {
          const stock=/** @type {import('../src/core/types.js').StockId} */(key);
          let deficit=Math.max(0,(quote.costs[stock]??0)-game.state.resources[stock]);
          if (stock==='D') deficit+=Math.max(0,(quote.costs.K??0)-game.state.resources.K)/analysisYield(game,definitions,balance);
          const seconds=deficit/((rates[stock]??0)+4*yieldPerClick);
          if (seconds>longest) { longest=seconds; actionId=action.id; }
        }
      }
      if (actionId) dispatch(game,definitions,balance,{type:'performStationAction',actionId});
      advanceTicks(game,definitions,balance,1);
      quote=quoteCommand(game,definitions,balance,command);
    }
    dispatch(game,definitions,balance,command);
    milestones[investmentId]??=game.state.clock.tick*TICK_SECONDS;
  }
  for (const id of ['observing-routine','analysis-tools','outreach','outreach-activity','support-office',
    'supporter-group','target-jupiter','additional-telescope','supporter-appeals','outreach-activity',
    'supporter-group','supporter-group','additional-telescope','stable-mount','tracking','engineering',
    'target-saturn','supporter-appeals','reflector','permanent-enclosure','camera','workstation',
    'target-star-clusters','academy','research','appoint-fundraiser','photometry','robotic-dome',
    'target-nebulae','grant-office','observing-grant']) buy(id);
  const summary=getSummary(game,definitions,balance);
  return {game,report:{milestones,seconds:game.state.clock.tick*TICK_SECONDS,insight:summary.prestige.award,encouraged:summary.prestige.encouraged,expansionWaitSeconds:summary.prestige.expansionWaitSeconds,rates:summary.rates}};
}
/** Compare an actual reset against the identical attentive opening policy. */
export function runPacingComparison() {
  const first=runPacingOpening();
  const checkpoint=serializeGame(first.game);
  dispatch(first.game,definitions,balance,{type:'beginPrestige'});
  for (const upgradeId of ['engineering-heritage','shared-enthusiasm','institutional-memory']) {
    const result=dispatch(first.game,definitions,balance,{type:'buyInsightUpgrade',upgradeId});
    if (!result.ok) throw new Error(result.blockedReasons.join('; '));
  }
  dispatch(first.game,definitions,balance,{type:'startNextRun'});
  const rebuilt=runPacingOpening(first.game);
  return {checkpoint,game:rebuilt.game,report:{first:first.report,rebuilt:rebuilt.report}};
}
if (import.meta.main) console.log(JSON.stringify(runPacingComparison().report,null,2));
