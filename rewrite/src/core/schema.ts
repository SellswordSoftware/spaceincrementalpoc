// Small boundary validators also provide the save types; no parallel state schema.
export type Rule<T = unknown> = (value: unknown, path: string) => T;
export type Infer<T> = T extends Rule<infer V> ? V : never;
type Shape<T extends Record<string, Rule>> = { [K in keyof T]: Infer<T[K]> };
export class ValidationError extends Error {
  constructor(path: string, reason: string) {
    super(`${path}: ${reason}`);
    this.name = "ValidationError";
  }
}
export function requireValid(condition: unknown, path: string, reason: string): asserts condition {
  if (!condition) throw new ValidationError(path, reason);
}
export const text: Rule<string> = (value, path) => {
  requireValid(
    typeof value === "string" && value.trim().length > 0,
    path,
    "expected nonempty text",
  );
  return value;
};
export const id: Rule<string> = (value, path) => {
  const key = text(value, path);
  requireValid(
    /^[a-z][a-z0-9-]*$/.test(key) && key !== "constructor" && key !== "prototype",
    path,
    "expected a stable ID",
  );
  return key;
};
export const nonnegative: Rule<number> = (value, path) => {
  requireValid(
    typeof value === "number" && Number.isFinite(value) && value >= 0,
    path,
    "expected a finite nonnegative number",
  );
  return value;
};
export const integer: Rule<number> = (value, path) => {
  const number = nonnegative(value, path);
  requireValid(Number.isSafeInteger(number), path, "expected a safe integer");
  return number;
};
export const boolean: Rule<boolean> = (value, path) => {
  requireValid(typeof value === "boolean", path, "expected a boolean");
  return value;
};
export const choice =
  <const T extends readonly unknown[]>(options: T): Rule<T[number]> =>
  (value, path) => {
    requireValid(options.includes(value), path, `expected one of ${options.join(", ")}`);
    return value as T[number];
  };
export const nullable =
  <T>(rule: Rule<T>): Rule<T | null> =>
  (value, path) =>
    value === null ? null : rule(value, path);
export const array =
  <T>(item: Rule<T>): Rule<T[]> =>
  (value, path) => {
    requireValid(Array.isArray(value), path, "expected an array");
    return Array.from(value, (entry, index) => item(entry, `${path}[${index}]`));
  };
export function record(value: unknown, path: string): asserts value is Record<string, unknown> {
  requireValid(
    value !== null &&
      typeof value === "object" &&
      !Array.isArray(value) &&
      (Object.getPrototypeOf(value) === Object.prototype || Object.getPrototypeOf(value) === null),
    path,
    "expected a plain object",
  );
}
export const object =
  <T extends Record<string, Rule>>(fields: T): Rule<Shape<T>> =>
  (value, path) => {
    record(value, path);
    for (const key of Object.keys(value))
      requireValid(Object.hasOwn(fields, key), `${path}.${key}`, "unknown field");
    for (const [key, rule] of Object.entries(fields)) {
      requireValid(Object.hasOwn(value, key), `${path}.${key}`, "missing field");
      rule(value[key], `${path}.${key}`);
    }
    return value as Shape<T>;
  };
export const dictionary =
  <T>(keyRule: Rule<string>, valueRule: Rule<T>): Rule<Record<string, T>> =>
  (value, path) => {
    record(value, path);
    for (const [key, item] of Object.entries(value)) {
      keyRule(key, path);
      valueRule(item, `${path}.${key}`);
    }
    return value as Record<string, T>;
  };
