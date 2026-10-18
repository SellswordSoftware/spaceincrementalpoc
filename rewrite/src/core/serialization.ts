import type { Balance, Definitions } from "./types.ts";
import { record, requireValid } from "./schema.ts";
import { definitions as defaultDefinitions } from "../definitions/content.ts";
export function canonicalStringify(value: unknown): string {
  const ancestors = new Set();
  function encode(item: unknown, path: string): string {
    if (item === null || typeof item === "boolean" || typeof item === "string")
      return JSON.stringify(item);
    if (typeof item === "number") {
      requireValid(Number.isFinite(item), path, "nonfinite JSON number");
      return JSON.stringify(item);
    }
    requireValid(item !== undefined && typeof item === "object", path, "expected JSON data");
    requireValid(!ancestors.has(item), path, "cyclic JSON data");
    ancestors.add(item);
    let result;
    if (Array.isArray(item)) {
      requireValid(Object.keys(item).length === item.length, path, "expected a dense JSON array");
      result = `[${Array.from(item, (entry, index) => encode(entry, `${path}[${index}]`)).join(",")}]`;
    } else {
      record(item, path);
      requireValid(
        Object.getOwnPropertySymbols(item).length === 0,
        path,
        "symbol keys are not JSON data",
      );
      result = `{${Object.keys(item)
        .sort()
        .map((key) => `${JSON.stringify(key)}:${encode(item[key], `${path}.${key}`)}`)
        .join(",")}}`;
    }
    ancestors.delete(item);
    return result;
  }
  return encode(value, "$");
}
const hashes = new WeakMap<Definitions, WeakMap<Balance, string>>();
// Configuration objects are immutable during a run; validation and saves share this fingerprint.
export function getBalanceHash(balance: Balance, definitions: Definitions = defaultDefinitions) {
  let configurations = hashes.get(definitions);
  if (!configurations) {
    configurations = new WeakMap();
    hashes.set(definitions, configurations);
  }
  const cached = configurations.get(balance);
  if (cached) return cached;
  let hash = 0x811c9dc5;
  const bytes = new TextEncoder().encode(canonicalStringify({ balance, definitions }));
  for (const byte of bytes) hash = Math.imul(hash ^ byte, 0x01000193) >>> 0;
  const result = `fnv1a32-${hash.toString(16).padStart(8, "0")}`;
  configurations.set(balance, result);
  return result;
}
