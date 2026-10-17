// Runtime-neutral entry point shared by browser and headless scenarios.
export const prototypeInfo = Object.freeze({title:'Eyes on the Universe',stage:'P13 — Continuous progression and optional prestige'});
export { definitions } from '../definitions/content.js';
export { balance } from '../definitions/balance.js';
export { createGame, serializeGame, deserializeGame } from './state.js';
export { validateDefinitions, validateBalance, ValidationError } from './validate.js';
export { validateGame } from './validate-state.js';
export { quoteCommand, dispatch } from './commands.js';
export { advanceTicks } from './simulation.js';
export { getSummary } from './summary.js';
export { TICK_SECONDS } from './versions.js';
export { previewPrestige } from './prestige.js';
