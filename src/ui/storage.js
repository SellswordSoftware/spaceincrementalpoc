import { deserializeGame, serializeGame } from '../core/index.js';
const SAVE_KEY = 'eyes-on-the-universe.save';

export function storedSave() { return localStorage.getItem(SAVE_KEY); }
export function loadGame() { const raw=storedSave(); return raw ? deserializeGame(raw) : null; }
/** @param {import('../core/types.js').GameState} game */
export function saveGame(game) { localStorage.setItem(SAVE_KEY,serializeGame(game)); }
/** @param {string} raw @param {string} filename */
export function downloadSave(raw,filename) {
  const url=URL.createObjectURL(new Blob([raw],{type:'application/json'}));
  const link=document.createElement('a'); link.href=url; link.download=filename; link.click();
  setTimeout(() => URL.revokeObjectURL(url),1000);
}
/** @param {import('../core/types.js').GameState} game */
export function exportGame(game) { downloadSave(serializeGame(game),'eyes-on-the-universe-stations.json'); }
/** Retain a local fallback as well as offering an export before replacing the old run.
 * @param {string} raw */
export function backupPreviousSave(raw) { localStorage.setItem(`${SAVE_KEY}.previous-economy`,raw); }
