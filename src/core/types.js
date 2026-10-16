/**
 * @typedef {'D'|'F'|'K'|'I'|'X'|'E'|'C'} StockId
 * @typedef {'moon'|'jupiter'|'saturn'|'star-clusters'|'nebulae'} TargetId
 * @typedef {StockId|'N'|'Insight'} CurrencyId
 * @typedef {'observatory'|'analysis'|'outreach'|'support'|'academy'|'research'|'science'} StationId
 * @typedef {'observing'|'analysis'|'outreach'|'support'|'teaching'|'research'|'science'} StatId
 * @typedef {Partial<Record<CurrencyId,number>>} Costs
 * @typedef {Partial<Record<StockId|'training'|'science',number>>} Output
 * @typedef {{id:string,name:string,kind:string,reset:string,spendable:boolean,revealAt:string}} ResourceDefinition
 * @typedef {{id:TargetId,name:string,investmentId:string|null,yield:number,claim:string}} TargetDefinition
 * @typedef {{id:StationId,name:string,subtitle:string,output:string,requires:string[],reveal:string[],use:string}} StationDefinition
 * @typedef {{id:string,name:string,station:StationId,kind:'unlock'|'producer'|'upgrade'|'appointment'|'discovery',requires:string[],cost:Costs,growth:number,maxLevel:number,output:Output,boost?:{stat:StatId,bonus:number},effect:string}} Investment
 * @typedef {{id:string,name:string,station:StationId,requires:string[],output:Output}} StationAction
 * @typedef {{id:string,name:string,requires:string[],cost:Costs,work:number,publications:number,description:string}} ProgramDefinition
 * @typedef {{id:string,name:string,stats:StatId[],factor:number,cost:number,growth:number,maxLevel:number,description:string}} InsightUpgrade
 * @typedef {{points:number,totalEarned:number,upgrades:Record<string,number>,phase:'playing'|'shop',lastAward:number}} InsightState
 * @typedef {{contentVersion:string,resources:ResourceDefinition[],stations:StationDefinition[],targets:TargetDefinition[],investments:Investment[],actions:StationAction[],programs:ProgramDefinition[],insightUpgrades:InsightUpgrade[]}} Definitions
 * @typedef {{id:string,startingStocks:Record<StockId,number>,course:{cost:Costs,work:number,baseRate:number},knowledgePerData:number,actionCooldownTicks:number,programRate:number,prestige:{requires:string[],baseAward:number}}} Balance
 * @typedef {{clock:{tick:number,campaignIndex:number},insight:InsightState,resources:Record<StockId,number>,purchases:Record<string,number>,population:{total:number},course:{progress:number}|null,science:{publications:number,program:{id:string,progress:number}|null},journal:TargetId[],nextActionTick:number,modified:boolean}} State
 * @typedef {{schemaVersion:number,contentVersion:string,balanceId:string,balanceHash:string,simulationVersion:string,state:State}} GameState
 * @typedef {{type:'buyInvestment',investmentId:string}|{type:'performStationAction',actionId:string}|{type:'processData',quantity:number}|{type:'enrollCourse'}|{type:'startProgram',programId:string}|{type:'beginPrestige'}|{type:'buyInsightUpgrade',upgradeId:string}|{type:'startNextRun'}} Command
 * @typedef {{ok:boolean,costs:Costs,blockedReasons:string[]}} CommandQuote
 * @typedef {{tick:number,type:string,id:string,detail:string}} GameEvent
 * @typedef {CommandQuote & {events:GameEvent[]}} CommandResult
 */
export {};
