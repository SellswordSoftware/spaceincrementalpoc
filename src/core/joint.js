import { multiplier } from './rates.js';

/** Discrete joint rewards and a single finite synthesis. No recurring wallet costs.
 * @param {import('./types.js').GameState} game @param {import('./types.js').Definitions} definitions
 * @param {number} seconds @returns {import('./types.js').GameEvent[]} */
export function advanceJointScience(game,definitions,seconds) {
  /** @type {import('./types.js').GameEvent[]} */
  const events=[];
  for (const program of definitions.jointPrograms) {
    const state=game.state.joint.programs[program.id];
    if (!state) continue;
    const elapsed=state.progress+seconds;
    const cycles=Math.floor((elapsed+1e-9)/program.seconds);
    state.progress=elapsed%program.seconds;
    if (!cycles) continue;
    state.cycles+=cycles;
    const credits=state.remainder+cycles*program.credits*multiplier(game,definitions,'collaboration');
    const publications=state.publicationRemainder+cycles*program.publications*multiplier(game,definitions,'science');
    const wholeCredits=Math.floor(credits+1e-9),wholePublications=Math.floor(publications+1e-9);
    state.remainder=Math.max(0,credits-wholeCredits);
    state.publicationRemainder=Math.max(0,publications-wholePublications);
    game.state.resources.C+=wholeCredits;
    game.state.science.publications+=wholePublications;
    events.push({tick:game.state.clock.tick,type:'joint-result',id:program.id,detail:`${program.name}: ${wholeCredits} Collaboration Credit(s) and ${wholePublications} Publication(s). The next cycle is underway.`});
  }
  const joint=game.state.joint;
  if (joint.finaleProgress!==null && joint.completedAtTick===null) {
    joint.finaleProgress=Math.min(definitions.finale.seconds,joint.finaleProgress+seconds);
    if (joint.finaleProgress>=definitions.finale.seconds) {
      joint.completedAtTick=game.state.clock.tick;
      events.push({tick:game.state.clock.tick,type:'completion',id:'eyes-on-the-universe',detail:'Eyes on the Universe complete. Your observatories now connect the changing sky, planetary systems and light from early galaxies. Keep observing, or prestige for another run.'});
    }
  }
  return events;
}
