import type { GameEvent } from "./types.ts";
export const event = (tick: number, type: string, id: string, detail: string): GameEvent => ({
  tick,
  type,
  id,
  detail,
});
