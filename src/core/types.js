/**
 * @typedef {'D'|'F'|'K'|'I'|'X'|'E'|'C'} StockId
 * @typedef {'moon'|'jupiter'|'saturn'|'star-clusters'|'nebulae'|'galaxies'|'galaxy-clusters'|'radio-sources'|'transit-targets'|'infrared-fields'|'deep-field'} TargetId
 * @typedef {StockId|'N'|'Insight'} CurrencyId
 * @typedef {'observatory'|'analysis'|'outreach'|'support'|'academy'|'research'|'science'|'engineering'|'radio'|'space'|'joint'} StationId
 * @typedef {'observing'|'analysis'|'outreach'|'support'|'teaching'|'research'|'science'|'engineering'|'collaboration'} StatId
 * @typedef {Partial<Record<CurrencyId,number>>} Costs
 * @typedef {Partial<Record<StockId|'training'|'science',number>>} Output
 * @typedef {{id:string,name:string,kind:string,reset:string,spendable:boolean,revealAt:string}} ResourceDefinition
 * @typedef {{id:TargetId,name:string,investmentId:string|null,yield:number,claim:string}} TargetDefinition
 * @typedef {{id:StationId,name:string,subtitle:string,output:string,requires:string[],reveal:string[],use:string}} StationDefinition
 * @typedef {{id:string,name:string,station:StationId,kind:'unlock'|'producer'|'upgrade'|'appointment'|'discovery',requires:string[],cost:Costs,growth:number,maxLevel:number,output:Output,publications?:number,grant?:boolean,grantBonus?:number,boost?:{stat:StatId,bonus:number},effect:string}} Investment
 * @typedef {{id:string,name:string,station:StationId,requires:string[],output:Output}} StationAction
 * @typedef {{id:string,name:string,requires:string[],publicationsPerSecond:number,description:string}} ProgramDefinition
 * @typedef {{id:string,name:string,stats:StatId[],factor:number,factors?:Partial<Record<StatId,number>>,cost:number,growth:number,maxLevel:number,description:string}} InsightUpgrade
 * @typedef {{points:number,totalEarned:number,upgrades:Record<string,number>,phase:'playing'|'shop',lastAward:number}} InsightState
 * @typedef {{id:string|null,name:string,description:string,telescopes:number}} FacilityDefinition
 * @typedef {{id:string,name:string,commissionId:string,publicationsPerSecond:number,description:string}} MissionDefinition
 * @typedef {{completedAtTick:number|null}} JointState
 * @typedef {{id:string,name:string,investmentId:string,creditsPerSecond:number,publicationsPerSecond:number,contributors:string[],description:string}} JointProgramDefinition
 * @typedef {{investmentId:string,name:string,description:string}} FinaleDefinition
 * @typedef {{contentVersion:string,resources:ResourceDefinition[],stations:StationDefinition[],targets:TargetDefinition[],facilities:FacilityDefinition[],missions:MissionDefinition[],jointPrograms:JointProgramDefinition[],finale:FinaleDefinition,investments:Investment[],actions:StationAction[],programs:ProgramDefinition[],insightUpgrades:InsightUpgrade[]}} Definitions
 * @typedef {{id:string,startingStocks:Record<StockId,number>,course:{seconds:number},knowledgePerData:number,actionCooldownTicks:number,prestige:{requires:string[],baseAward:number}}} Balance
 * @typedef {{run:number,eligibleAtTick:number|null,endedAtTick:number,insight:number}} RunRecord
 * @typedef {{clock:{tick:number,totalTicks:number,totalIsPartial:boolean,campaignIndex:number,prestigeEligibleAtTick:number|null,eligibilityKnown:boolean,completedRuns:RunRecord[]},insight:InsightState,resources:Record<StockId,number>,purchases:Record<string,number>,population:{total:number},academy:{timers:number[],remainder:number},science:{publications:number},reviewedOptions:string[],joint:JointState,journal:TargetId[],nextActionTick:number,modified:boolean}} State
 * @typedef {{schemaVersion:number,contentVersion:string,balanceId:string,balanceHash:string,simulationVersion:string,state:State}} GameState
 * @typedef {{type:'reviewOption',investmentId:string}|{type:'buyInvestment',investmentId:string}|{type:'performStationAction',actionId:string}|{type:'processData',quantity:number}|{type:'beginPrestige'}|{type:'buyInsightUpgrade',upgradeId:string}|{type:'startNextRun'}} Command
 * @typedef {{ok:boolean,costs:Costs,blockedReasons:string[]}} CommandQuote
 * @typedef {{tick:number,type:string,id:string,detail:string}} GameEvent
 * @typedef {CommandQuote & {events:GameEvent[]}} CommandResult
 */
export {};
