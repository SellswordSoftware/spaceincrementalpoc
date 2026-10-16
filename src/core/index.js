// This entry point must remain usable in both Node and the browser.
// Playable browser controls arrive in P4.
export const prototypeInfo = Object.freeze({
  title: 'Eyes on the Universe',
  stage: 'P3 — Starter economy',
});

export { definitions } from '../definitions/content.js';
export { balance } from '../definitions/balance.js';
export { createGame, serializeGame, deserializeGame } from './state.js';
export { validateDefinitions, validateBalance, ValidationError } from './validate.js';
export { validateGame } from './validate-state.js';
export { quoteCommand, dispatch } from './commands.js';
export { advanceTicks } from './simulation.js';
export { getSummary } from './summary.js';
export { explainModifier } from './rates.js';
export { TICK_SECONDS } from './versions.js';
