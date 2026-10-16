import { deserializeGame, serializeGame } from '../core/index.js';

const SAVE_KEY = 'eyes-on-the-universe.save';

export function loadGame() {
  const stored = localStorage.getItem(SAVE_KEY);
  return stored ? deserializeGame(stored) : null;
}

/** @param {import('../core/types.js').GameState} game */
export function saveGame(game) {
  localStorage.setItem(SAVE_KEY, serializeGame(game));
}

/** @param {import('../core/types.js').GameState} game */
export function exportGame(game) {
  const url = URL.createObjectURL(new Blob([serializeGame(game)], { type: 'application/json' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = 'eyes-on-the-universe-save.json';
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
