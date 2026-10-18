import type { Definitions } from "../core/types.ts";
import { validateDefinitions } from "../core/validate.ts";

const byId = <T extends { id: string }>(items: T[]) =>
  new Map(items.map((item) => [item.id, item]));
function compile(definitions: Definitions) {
  validateDefinitions(definitions);
  return {
    investments: byId(definitions.investments),
    actions: byId(definitions.actions),
    stations: byId(definitions.stations),
    resources: byId(definitions.resources),
    insightUpgrades: byId(definitions.insightUpgrades),
    discoveries: new Map(definitions.targets.map((target) => [target.investmentId, target])),
    appointments: definitions.investments.filter((item) => item.kind === "appointment"),
    grants: definitions.investments.filter((item) => item.grant),
    producers: definitions.investments.filter((item) => item.kind === "producer"),
    boosts: definitions.investments.filter((item) => item.boost),
  };
}
const catalogs = new WeakMap<Definitions, ReturnType<typeof compile>>();
// Definitions are configuration: replace the object when editing content, never mutate it in play.
export function catalog(definitions: Definitions) {
  let result = catalogs.get(definitions);
  if (!result) {
    result = compile(definitions);
    catalogs.set(definitions, result);
  }
  return result;
}
