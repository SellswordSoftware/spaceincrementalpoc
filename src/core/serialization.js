import { record, requireValid } from './schema.js';
import { definitions as defaultDefinitions } from '../definitions/content.js';

/** Stable JSON with sorted object keys; rejects lossy/non-JSON input.
 * @param {unknown} value @returns {string}
 */
export function canonicalStringify(value) {
  const ancestors = new Set();
  /** @param {unknown} item @param {string} path @returns {string} */
  function encode(item, path) {
    if (item === null || typeof item === 'boolean' || typeof item === 'string') return JSON.stringify(item);
    if (typeof item === 'number') {
      requireValid(Number.isFinite(item), path, 'nonfinite JSON number');
      return JSON.stringify(item);
    }
    requireValid(item !== undefined && typeof item === 'object', path, 'expected JSON data');
    requireValid(!ancestors.has(item), path, 'cyclic JSON data');
    ancestors.add(item);
    let result;
    if (Array.isArray(item)) {
      requireValid(Object.keys(item).length === item.length, path, 'expected a dense JSON array');
      result = `[${Array.from(item, (entry, index) => encode(entry, `${path}[${index}]`)).join(',')}]`;
    } else {
      record(item, path);
      requireValid(Object.getOwnPropertySymbols(item).length === 0, path, 'symbol keys are not JSON data');
      result = `{${Object.keys(item).sort().map(key => `${JSON.stringify(key)}:${encode(item[key], `${path}.${key}`)}`).join(',')}}`;
    }
    ancestors.delete(item);
    return result;
  }
  return encode(value, '$');
}

/** Reproducibility fingerprint, not a cryptographic integrity check.
 * @param {import('./types.js').Balance} balance
 * @param {import('./types.js').Definitions} [definitions]
 */
export function getBalanceHash(balance, definitions = defaultDefinitions) {
  let hash = 0x811c9dc5;
  const bytes = new TextEncoder().encode(canonicalStringify({ balance, definitions }));
  for (const byte of bytes) hash = Math.imul(hash ^ byte, 0x01000193) >>> 0;
  return `fnv1a32-${hash.toString(16).padStart(8, '0')}`;
}
