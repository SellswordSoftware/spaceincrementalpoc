import { getSummary } from './summary.js';
import { quoteCommand } from './commands.js';
import { TICK_SECONDS } from './versions.js';

/** @typedef {import('./types.js').GameState} Game */
/** @typedef {ReturnType<PlaytestLog['snapshot']>} Snapshot */
/** @typedef {{sequence:number,at:string,type:string,trackedSeconds:number,sinceAction:number|null,sinceInvestment:number|null,sinceSpend:Record<string,number>,detail:Record<string,unknown>,before:Snapshot|null,after:Snapshot}} Entry */
/** @typedef {{command:string,id:string,count:number,quantity:number,costs:Record<string,number>,before:Snapshot,after:Snapshot}} Activity */
/** @typedef {{format:1,startedAt:string,trackedTicks:number,nextSampleTick:number,sequence:number,droppedEntries:number,consoleEnabled:boolean,targetId:string|null,lastAction:number|null,lastInvestment:number|null,lastSpend:Record<string,number>,configurations:Record<string,unknown>,entries:Entry[],pending:Activity|null}} LogData */
const SAMPLE_TICKS=30/TICK_SECONDS;
const MAX_ENTRIES=2000;
/** @param {number} value */
const rounded=value=>Math.round(value*10000)/10000;

/** Runtime-neutral diagnostics. Separate from game state; never awards or spends resources. */
export class PlaytestLog {
  /** @param {import('./types.js').Definitions} definitions @param {import('./types.js').Balance} balance @param {LogData|null} [saved] */
  constructor(definitions,balance,saved=null) {
    this.definitions=definitions;
    this.balance=balance;
    /** @type {LogData} */
    this.data=saved??{format:1,startedAt:new Date().toISOString(),trackedTicks:0,nextSampleTick:SAMPLE_TICKS,sequence:0,droppedEntries:0,consoleEnabled:false,targetId:null,lastAction:null,lastInvestment:null,lastSpend:{},configurations:{},entries:[],pending:null};
  }
  /** @param {Game} game */
  snapshot(game) {
    const summary=getSummary(game,this.definitions,this.balance);
    const stocks={...game.state.resources,N:summary.population.available,P:game.state.science.publications,Insight:game.state.insight.points};
    const rates={D:0,F:0,K:0,I:0,X:0,E:0,C:0,...summary.rates,N:summary.rates.training??0,P:summary.rates.science??0};
    delete rates.training; delete rates.science;
    const nextId=this.data.targetId??summary.guidance.nextId;
    const item=this.definitions.investments.find(item=>item.id===nextId);
    const next=nextId?{id:nextId,...(item?quoteCommand(game,this.definitions,this.balance,{type:'buyInvestment',investmentId:nextId}):{ok:false,costs:{},blockedReasons:[summary.guidance.objective]})}:null;
    // Support both the original per-run clock and later campaign-clock saves.
    const clock=/** @type {{totalTicks?:number,totalIsPartial?:boolean}} */(game.state.clock);
    return {at:new Date().toISOString(),config:game.balanceHash,run:game.state.clock.campaignIndex,runSeconds:game.state.clock.tick*TICK_SECONDS,
      campaignSeconds:clock.totalTicks===undefined?null:clock.totalTicks*TICK_SECONDS,campaignTimePartial:clock.totalIsPartial??game.state.clock.campaignIndex>1,
      trackedSeconds:this.data.trackedTicks*TICK_SECONDS,phase:game.state.insight.phase,
      stocks:Object.fromEntries(Object.entries(stocks).map(([id,value])=>[id,rounded(value)])),
      rates:Object.fromEntries(Object.entries(rates).map(([id,value])=>[id,rounded(value)])),
      people:summary.population,
      prestige:{eligible:summary.prestige.eligible,award:summary.prestige.award},next};
  }
  /** @param {Game} game @param {string} type @param {Record<string,unknown>} [detail] @param {Snapshot|null} [before] */
  mark(game,type,detail={},before=null) {
    this.flush();
    if (type==='restart' || type==='import') {
      this.data.lastAction=null;this.data.lastInvestment=null;this.data.lastSpend={};this.data.targetId=null;
    }
    const inventory=['session','sample','import','restart','export'].includes(type)?{purchases:{...game.state.purchases},insightUpgrades:{...game.state.insight.upgrades}}:{};
    return this.append(type,{...detail,...inventory},before,this.snapshot(game));
  }
  /** @param {string} type @param {Record<string,unknown>} detail @param {Snapshot|null} before @param {Snapshot} after */
  append(type,detail,before,after) {
    const seconds=after.trackedSeconds;
    /** @type {Entry} */
    const entry={sequence:++this.data.sequence,at:after.at,type,trackedSeconds:seconds,
      sinceAction:this.data.lastAction===null?null:seconds-this.data.lastAction,
      sinceInvestment:this.data.lastInvestment===null?null:seconds-this.data.lastInvestment,
      sinceSpend:Object.fromEntries(Object.entries(this.data.lastSpend).map(([id,time])=>[id,seconds-time])),detail,before,after};
    this.data.entries.push(entry);
    if (this.data.entries.length>MAX_ENTRIES) {
      const removed=this.data.entries.length-MAX_ENTRIES;
      this.data.entries.splice(0,removed); this.data.droppedEntries+=removed;
    }
    if (this.data.consoleEnabled) console.info(`[playtest R${after.run} ${after.runSeconds.toFixed(1)}s | ${seconds.toFixed(1)}s tracked] ${type} ${String(detail.id??detail.investmentId??'')}`,JSON.stringify(entry));
    return entry;
  }
  /** @param {Game} game @param {string} reason */
  session(game,reason) {
    this.data.configurations[game.balanceHash]={schemaVersion:game.schemaVersion,simulationVersion:game.simulationVersion,
      contentVersion:game.contentVersion,balanceHash:game.balanceHash,definitions:this.definitions,balance:this.balance};
    this.mark(game,'session',{reason,balanceHash:game.balanceHash,historyStartsInRun:game.state.clock.campaignIndex,historyStartsAtRunSeconds:game.state.clock.tick*TICK_SECONDS});
  }
  /** @param {Game} game @param {import('./types.js').Command} command @param {import('./types.js').CommandResult} result @param {Snapshot} before */
  command(game,command,result,before) {
    if (command.type==='reviewOption') return;
    const id='investmentId' in command?command.investmentId:'actionId' in command?command.actionId:'upgradeId' in command?command.upgradeId:command.type;
    const grouped=command.type==='performStationAction' || command.type==='processData';
    if (this.data.pending && (!grouped || this.data.pending.command!==command.type || this.data.pending.id!==id || !result.ok)) this.flush();
    if (result.ok && command.type==='buyInvestment') {
      const item=this.definitions.investments.find(item=>item.id===command.investmentId);
      if (item && (game.state.purchases[item.id]??0)>=item.maxLevel) this.data.targetId=null;
    }
    const after=this.snapshot(game);
    const previousInvestmentGap=this.data.lastInvestment===null?null:after.trackedSeconds-this.data.lastInvestment;
    if (!result.ok) {this.append('blocked',{command,id,reasons:result.blockedReasons,costs:result.costs},before,after);return;}
    this.data.lastAction=after.trackedSeconds;
    if (command.type==='buyInvestment') this.data.lastInvestment=after.trackedSeconds;
    for (const [currency,cost] of Object.entries(result.costs)) if (cost>0) this.data.lastSpend[currency]=after.trackedSeconds;
    if (grouped) {
      const pending=this.data.pending??{command:command.type,id,count:0,quantity:0,costs:{},before,after};
      pending.count++; pending.quantity+=command.type==='processData'?command.quantity:0; pending.after=after;
      for (const [currency,cost] of Object.entries(result.costs)) pending.costs[currency]=(pending.costs[currency]??0)+cost;
      this.data.pending=pending;
    } else this.append('command',{command,id,costs:result.costs,previousInvestmentGap,level:command.type==='buyInvestment'?game.state.purchases[id]:command.type==='buyInsightUpgrade'?game.state.insight.upgrades[id]:null,events:result.events},before,after);
  }
  /** Inspecting an unaffordable option supplies the actual saving target for later samples.
   * @param {Game} game @param {string} investmentId */
  inspect(game,investmentId) {
    if (this.data.targetId===investmentId) return;
    this.data.targetId=investmentId;
    this.mark(game,'inspect',{investmentId});
  }
  flush() {
    const pending=this.data.pending;
    if (!pending) return;
    this.data.pending=null;
    this.append('activity',{command:pending.command,id:pending.id,count:pending.count,quantity:pending.quantity,costs:pending.costs},pending.before,pending.after);
  }
  /** @param {Game} game @param {number} ticks */
  advanced(game,ticks) {
    this.data.trackedTicks+=ticks;
    if (this.data.trackedTicks>=this.data.nextSampleTick) {
      this.mark(game,'sample');
      this.data.nextSampleTick=this.data.trackedTicks+SAMPLE_TICKS;
    }
  }
  ticksUntilSample() {return Math.max(1,this.data.nextSampleTick-this.data.trackedTicks);}
  storageJSON() {
    let json=JSON.stringify(this.data);
    // Bound local storage independently of the game save, including large late-run snapshots.
    while (json.length>1500000 && this.data.entries.length) {
      const removed=Math.max(1,Math.ceil(this.data.entries.length/10));
      this.data.entries.splice(0,removed);this.data.droppedEntries+=removed;
      json=JSON.stringify(this.data);
    }
    return json;
  }
  export() {
    this.flush();
    return JSON.stringify({currencyLegend:{D:'Data',K:'Knowledge',I:'Interest',F:'Funding',N:'Unassigned people',P:'Publications',X:'Expertise',E:'Engineering Progress',C:'Collaboration Credits',Insight:'Insight'},
      ...this.data,notes:'Tracked seconds count simulation advances observed by this log, excluding pauses/offline/shop. Run times identify the original save offset. Imports/restarts are marked, not assumed continuous campaigns. Missing sinceSpend keys have no recorded spend. Up to 2000 entries / 1.5 million stored characters are retained; droppedEntries reports truncation. Exports are local files, never uploaded automatically.'},null,2);
  }
}
