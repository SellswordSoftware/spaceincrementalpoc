import { advanceTicks, balance, definitions, dispatch, quoteCommand, TICK_SECONDS } from '../src/core/index.js';
import { analysisYield } from '../src/core/rates.js';

/** A fixed scenario policy: save toward a purchase while converting only needed Data.
 * @param {import('../src/core/types.js').GameState} game @param {Record<string,number>} milestones */
export function investor(game,milestones) {
  /** @param {string} investmentId */
  return function buy(investmentId) {
    const item=definitions.investments.find(item=>item.id===investmentId);
    if (item && (game.state.purchases[investmentId]??0)>=item.maxLevel) return;
    const command=/** @type {const} */({type:'buyInvestment',investmentId});
    const deadline=game.state.clock.tick+4000000;
    let quote=quoteCommand(game,definitions,balance,command);
    while (!quote.ok) {
      if (game.state.clock.tick>=deadline) throw new Error(`Progression stalled at ${investmentId}: ${quote.blockedReasons.join('; ')}`);
      const needed=Math.max(0,(quote.costs.K??0)-game.state.resources.K);
      const quantity=Math.min(Math.max(0,game.state.resources.D-(quote.costs.D??0)),needed/analysisYield(game,definitions,balance));
      if (quantity>1e-9) dispatch(game,definitions,balance,{type:'processData',quantity});
      advanceTicks(game,definitions,balance,4);
      quote=quoteCommand(game,definitions,balance,command);
    }
    const result=dispatch(game,definitions,balance,command);
    if (!result.ok) throw new Error(result.blockedReasons.join('; '));
    milestones[investmentId]??=game.state.clock.tick*TICK_SECONDS;
    return result;
  };
}
