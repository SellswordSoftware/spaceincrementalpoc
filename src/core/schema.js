// Small explicit validators, shared by definitions and saves; no schema runtime dependency.
/** @typedef {(value: unknown, path: string) => void} Rule */

export class ValidationError extends Error {
  /** @param {string} path @param {string} reason */
  constructor(path, reason) {
    super(`${path}: ${reason}`);
    this.name = 'ValidationError';
  }
}

/** @param {unknown} condition @param {string} path @param {string} reason @returns {asserts condition} */
export function requireValid(condition, path, reason) {
  if (!condition) throw new ValidationError(path, reason);
}

/** @type {Rule} */
export const text = (value, path) => requireValid(typeof value === 'string' && value.trim().length > 0, path, 'expected nonempty text');
/** @type {Rule} */
export const id = (value, path) => requireValid(typeof value === 'string' && /^[a-z][a-z0-9-]*$/.test(value) && value !== 'constructor' && value !== 'prototype', path, 'expected a stable ID');
/** @type {Rule} */
export const nonnegative = (value, path) => requireValid(typeof value === 'number' && Number.isFinite(value) && value >= 0, path, 'expected a finite nonnegative number');
/** @type {Rule} */
export const integer = (value, path) => {
  nonnegative(value, path);
  requireValid(Number.isSafeInteger(value), path, 'expected a safe integer');
};
/** @type {Rule} */
export const boolean = (value, path) => requireValid(typeof value === 'boolean', path, 'expected a boolean');
/** @param {readonly unknown[]} options @returns {Rule} */
export const choice = (options) => (value, path) => requireValid(options.includes(value), path, `expected one of ${options.join(', ')}`);
/** @param {Rule} item @returns {Rule} */
export const array = (item) => (value, path) => {
  requireValid(Array.isArray(value), path, 'expected an array');
  for (let index = 0; index < value.length; index++) item(value[index], `${path}[${index}]`);
};
/** @param {unknown} value @param {string} path @returns {asserts value is Record<string, unknown>} */
export function record(value, path) {
  requireValid(value !== null && typeof value === 'object' && !Array.isArray(value)
    && (Object.getPrototypeOf(value) === Object.prototype || Object.getPrototypeOf(value) === null), path, 'expected a plain object');
}
/** @param {Record<string, Rule>} fields @returns {Rule} */
export const object = (fields) => (value, path) => {
  record(value, path);
  for (const key of Object.keys(value)) requireValid(Object.hasOwn(fields, key), `${path}.${key}`, 'unknown field');
  for (const [key, rule] of Object.entries(fields)) {
    requireValid(Object.hasOwn(value, key), `${path}.${key}`, 'missing field');
    rule(value[key], `${path}.${key}`);
  }
};
/** @param {Rule} keyRule @param {Rule} valueRule @returns {Rule} */
export const dictionary = (keyRule, valueRule) => (value, path) => {
  record(value, path);
  for (const [key, item] of Object.entries(value)) {
    keyRule(key, path);
    valueRule(item, `${path}.${key}`);
  }
};
/** @type {Rule} */
export const emptyArray = (value, path) => {
  requireValid(Array.isArray(value) && value.length === 0, path, 'must be empty until this subsystem is implemented');
};
