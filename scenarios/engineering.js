import { balance, definitions, getSummary, TICK_SECONDS } from '../src/core/index.js';
import { previewInvestment } from '../src/core/rates.js';
import { investor } from './invest.js';
import { runPrestigeScenario } from './prestige.js';

/** @param {import('../src/core/types.js').GameState} game */
export function runEngineeringScenario(game) {
  const started=game.state.clock.tick;
  /** @type {Record<string,number>} */
  const milestones={};
  const buy=investor(game,milestones);
  const before=getSummary(game,definitions,balance);
  buy('engineering'); buy('engineering-bench'); buy('appoint-engineer'); buy('engineering-methods');
  // Grow Research and science before their advanced capabilities are required.
  for (let i=0;i<3;i++) { buy('mentoring-program'); buy('appoint-researcher'); }
  buy('appoint-scientist'); buy('science-practice'); buy('science-practice');
  buy('advanced-calibration');
  buy('permanent-enclosure'); buy('robotic-dome'); buy('spectrograph');
  const beforeScience=getSummary(game,definitions,balance).rates.science??0;
  buy('stellar-spectroscopy');
  const afterScience=getSummary(game,definitions,balance).rates.science??0;
  buy('advanced-grants');
  const grantPurchase=buy('research-grant');
  for (let i=0;i<2;i++) buy('research-grant');
  buy('expanded-observatory'); buy('target-galaxies'); buy('mountain-telescope'); buy('target-galaxy-clusters');
  const grantBefore=getSummary(game,definitions,balance).grants.rate;
  const fundraiserBefore=previewInvestment(game,definitions,balance,'appoint-fundraiser').passive.F;
  buy('research-impact');
  const fundraiserAfter=previewInvestment(game,definitions,balance,'appoint-fundraiser').passive.F;
  const after=getSummary(game,definitions,balance);
  return {game,report:{milestones,elapsedSeconds:(game.state.clock.tick-started)*TICK_SECONDS,
    grantCosts:grantPurchase?.costs??{},grantBefore,grantAfter:after.grants.rate,fundraiserBefore,fundraiserAfter,beforeData:before.rates.D??0,afterData:after.rates.D??0,beforeScience,afterScience,facility:after.observing.current.name}};
}
if (import.meta.main) console.log(JSON.stringify(runEngineeringScenario(runPrestigeScenario().game).report,null,2));
