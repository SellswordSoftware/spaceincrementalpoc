/**
 * @typedef {'F'|'K'|'I'|'X'|'E'|'C'} StockId
 * @typedef {'F'|'D'|'K'|'I'|'N'|'X'|'P'|'E'|'C'|'L'} ResourceId
 * @typedef {'installedHardware'|'permanentMethod'|'permanentAutomation'|'permanentQualification'|'campaignOperation'|'campaignSpecialization'|'campaignCollaboration'|'legacy'} PersistenceClass
 * @typedef {{id: ResourceId, name: string, kind: 'stock'|'typedInventory'|'population'|'achievement'|'legacy', reset: 'reset'|'retain', spendable: boolean, revealAt: string}} ResourceDefinition
 * @typedef {{kind: 'multiply', stat: 'observing.capacity'|'analysis.capacity'|'outreach.capacity', value: number}|{kind: 'unlock', capability: 'outreach'|'tracking'|'imaging'|'fundedAnalysis'}} Effect
 * @typedef {{id: string, name: string, revealPrerequisites: string[], purchasePrerequisites: string[]}} GatedDefinition
 * @typedef {GatedDefinition & {persistence: PersistenceClass, maxLevel: number, cost: {base: Partial<Record<ResourceId, number>>, growth: number}, effects: Effect[], panel: 'infrastructure'|'outreach'|'analysis'|'legacy'}} UpgradeDefinition
 * @typedef {{kind:'evidence', targetId:string, quantity:number}|{kind:'interest', quantity:number}} MilestoneCondition
 * @typedef {{id: string, prerequisites: string[], autoUnlock?: boolean, condition?:MilestoneCondition, journalTarget?:string}} GateDefinition
 * @typedef {{id: string, name: string, tasks: string[], purchasePrerequisites: string[], cost: Partial<Record<ResourceId, number>>}} InstrumentDefinition
 * @typedef {{id: string, name: string, fictional: boolean, dataType: string, requiredInstrument: string, sourceNote: string, permittedClaim: string}} TargetDefinition
 * @typedef {'observing.capacity'|'analysis.capacity'|'outreach.capacity'} StatId
 * @typedef {{kind:'observe', targetId:string, mode:'visual'|'camera', dataPerWork:number}|{kind:'analyze', targetId:string, dataPerWork:number}|{kind:'outreach', interestCap:number}|{kind:'donations', fundingPerInterest:number}} Activity
 * @typedef {{id: string, name: string, prerequisites: string[], inputs: Partial<Record<StockId, number>>, outputs: Partial<Record<StockId, number>>, capacity: number, stat: StatId|null, requiresFounder: boolean, compatibleInstruments: string[], workRequired: number|null, activity?:Activity}} RecipeDefinition
 * @typedef {{id:string, targetId:string, type:string, instrumentId:string, mode:'visual'|'camera', startTick:number, endTick:number, quantity:number, consumed:number}} DataLot
 * @typedef {{lotId:string, targetId:string, type:string, mode:'visual'|'camera', startTick:number, endTick:number, quantity:number, allocated:number}} Evidence
 * @typedef {{id: string, recipeId: string, instrumentId: string|null, allocation: number, priority: number, progress: number}} Job
 * @typedef {{type: 'buyUpgrade', upgradeId: string}|{type: 'purchaseInstrument', instrumentId: string}|{type: 'setFounderTask', jobId: string|null}|{type: 'setJobAllocation', jobId: string, recipeId: string, instrumentId?: string|null, allocation: number}|{type: 'setJobPriority', jobId: string, priority: number}|{type:'setAudienceAllocation', donations:number, recruitment:number}} Command
 * @typedef {{tick: number, type: string, id: string, detail: string}} GameEvent
 * @typedef {{ok: boolean, costs: Partial<Record<ResourceId, number>>, blockedReasons: string[]}} CommandQuote
 * @typedef {CommandQuote & {events: GameEvent[]}} CommandResult
 * @typedef {{tick: number, command: Command, result: CommandResult}} CommandRecord
 * @typedef {{contentVersion: string, resources: ResourceDefinition[], gates: GateDefinition[], instruments: InstrumentDefinition[], targets: TargetDefinition[], upgrades: UpgradeDefinition[], recipes: RecipeDefinition[]}} Definitions
 * @typedef {{id: string, startingStocks: Record<StockId, number>, startingLegacy: number}} Balance
 * @typedef {{id: string, definitionId: string}} Instrument
 * @typedef {Object} State
 * @property {{tick: number, campaignStartTick: number, campaignIndex: number}} clock
 * @property {Record<StockId, number>} resources
 * @property {{instruments: Instrument[], upgrades: Record<string, number>}} institution
 * @property {{founder: {task: string}, groups: never[]}} population
 * @property {DataLot[]} data
 * @property {Job[]} jobs
 * @property {{evidence: Evidence[], activePrograms: never[], completedPrograms: never[]}} investigations
 * @property {{upgrades: Record<string, number>, publications: number, scientificOutput: number, interestEarned:number}} campaign
 * @property {{journal: string[], unlocked: string[], claimedDepthBonuses: never[]}} lifetime
 * @property {{balance: number, upgrades: Record<string, number>, purchaseHistory: never[]}} legacy
 * @property {{assignments: never[], audience:{donations:number, recruitment:number}}} preferences
 * @property {boolean} modified
 * @typedef {{schemaVersion: number, contentVersion: string, balanceId: string, balanceHash: string, simulationVersion: string, state: State}} GameState
 */
export {};
