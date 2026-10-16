import { createGame, prototypeInfo } from '../core/index.js';

const status = document.querySelector('#runtime-status');
if (!(status instanceof HTMLParagraphElement)) {
  throw new Error('The page is missing its runtime status paragraph.');
}

const game = createGame();
status.textContent = `${prototypeInfo.stage}: starter state ready (${game.state.resources.F} Funding, one founder, one telescope).`;
