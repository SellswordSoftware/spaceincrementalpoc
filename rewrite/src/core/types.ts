type Named<Id = string> = { id: Id; name: string };
type Described<Id = string> = Named<Id> & { description: string };
export type StockId = keyof State["resources"];

export type TargetId = State["journal"][number];
export type CurrencyId = StockId | "N" | "Insight";
export type StationId =
  | "observatory"
  | "analysis"
  | "outreach"
  | "support"
  | "academy"
  | "research"
  | "science"
  | "engineering"
  | "radio"
  | "space"
  | "joint";
export type StatId =
  | "observing"
  | "analysis"
  | "outreach"
  | "support"
  | "teaching"
  | "research"
  | "science"
  | "engineering"
  | "collaboration";
export type Costs = Partial<Record<CurrencyId, number>>;
export type Output = Partial<Record<StockId | "training" | "science", number>>;
export type ResourceDefinition = Named & {
  kind: string;
  reset: string;
  spendable: boolean;
  revealAt: string;
};
export type TargetDefinition = Named<TargetId> & {
  investmentId: string | null;
  yield: number;
  claim: string;
};
export type StationDefinition = Named<StationId> & {
  subtitle: string;
  output: string;
  requires: string[];
  reveal: string[];
  use: string;
};
export type Investment = Named & {
  station: StationId;
  kind: "unlock" | "producer" | "upgrade" | "appointment" | "discovery";
  requires: string[];
  cost: Costs;
  growth: number;
  maxLevel: number;
  output: Output;
  publications?: number;
  grant?: boolean;
  boost?: { stat: StatId; bonus: number };
  effect: string;
};
export type StationAction = Pick<Investment, "id" | "name" | "station" | "requires" | "output">;
export type ProgramDefinition = Described & {
  requires: string[];
  publicationsPerSecond: number;
};
export type InsightUpgrade = Described & {
  stats: StatId[];
  factor: number;
  factors?: Partial<Record<StatId, number>>;
  cost: number;
  growth: number;
  maxLevel: number;
};
export type InsightState = State["insight"];

export type FacilityDefinition = Described<string | null> & {
  telescopes: number;
};
export type MissionDefinition = Described & {
  commissionId: string;
  publicationsPerSecond: number;
};
export type JointState = State["joint"];

export type JointProgramDefinition = Described & {
  investmentId: string;
  creditsPerSecond: number;
  publicationsPerSecond: number;
  contributors: string[];
};
export type FinaleDefinition = { investmentId: string; name: string; description: string };
export type Definitions = {
  contentVersion: string;
  resources: ResourceDefinition[];
  stations: StationDefinition[];
  targets: TargetDefinition[];
  facilities: FacilityDefinition[];
  missions: MissionDefinition[];
  jointPrograms: JointProgramDefinition[];
  finale: FinaleDefinition;
  investments: Investment[];
  actions: StationAction[];
  programs: ProgramDefinition[];
  insightUpgrades: InsightUpgrade[];
};
export type Balance = {
  id: string;
  startingStocks: Record<StockId, number>;
  course: { seconds: number };
  knowledgePerData: number;
  actionCooldownTicks: number;
  prestige: { requires: string[]; baseAward: number };
};
export type State = GameState["state"];

export type GameState = import("./validate-state.ts").SaveData;

export type Command =
  | { type: "reviewOption"; investmentId: string }
  | { type: "buyInvestment"; investmentId: string }
  | { type: "performStationAction"; actionId: string }
  | { type: "processData"; quantity: number }
  | { type: "beginPrestige" }
  | { type: "buyInsightUpgrade"; upgradeId: string }
  | { type: "startNextRun" };
export type CommandQuote = { ok: boolean; costs: Costs; blockedReasons: string[] };
export type GameEvent = { tick: number; type: string; id: string; detail: string };
export type CommandResult = CommandQuote & { events: GameEvent[] };
