import { advanceTicks, balance, createGame, definitions, dispatch, getSummary, quoteCommand, TICK_SECONDS } from '../src/core/index.js';
import { analysisYield, scaledOutput } from '../src/core/rates.js';

/** One ordinary-command path reused for a fresh or prestige-accelerated run.
 * @param {import('../src/core/types.js').GameState} [game] */
export function runStationScenario(game=createGame()) {
  /** @type {Record<string,number>} */
  const milestones={};
  /** @param {import('../src/core/types.js').Command} command */
  function send(command) {
    const result=dispatch(game,definitions,balance,command);
    if (!result.ok) throw new Error(result.blockedReasons.join('; '));
  }
  /** @param {()=>boolean} ready @param {boolean} [analyze] */
  function wait(ready,analyze=false) {
    const deadline=game.state.clock.tick+24000;
    while (!ready()) {
      if (game.state.clock.tick>=deadline) throw new Error('Station progression stalled');
      if (analyze && game.state.resources.D>=10 && game.state.purchases['analysis-tools']) send({type:'processData',quantity:10});
      advanceTicks(game,definitions,balance,1);
    }
  }
  /** @param {string} investmentId */
  function buy(investmentId) {
    const command=/** @type {const} */({type:'buyInvestment',investmentId});
    wait(()=>quoteCommand(game,definitions,balance,command).ok,Boolean(definitions.investments.find(item=>item.id===investmentId)?.cost.K));
    send(command); milestones[investmentId]??=game.state.clock.tick*TICK_SECONDS;
  }
  function nextGraduate() {
    const before=game.state.population.total;
    const start=game.state.clock.tick;
    wait(()=>game.state.population.total>before);
    return (game.state.clock.tick-start)*TICK_SECONDS;
  }
  const observe=definitions.actions.find(action=>action.id==='observe');
  if (!observe) throw new Error('Missing observing action');
  for (let i=0;i<5;i++) { send({type:'performStationAction',actionId:'observe'}); advanceTicks(game,definitions,balance,1); }
  buy('observing-routine'); buy('analysis-tools'); buy('archive-research');
  wait(()=>game.state.resources.D>=10);
  const beforeProcessing=game.state.resources.K;
  const processingRate=getSummary(game,definitions,balance).rates.D;
  send({type:'processData',quantity:10});
  const instantKnowledge=game.state.resources.K-beforeProcessing;
  const processingRateAfter=getSummary(game,definitions,balance).rates.D;
  buy('outreach'); buy('outreach-activity'); buy('support-office'); buy('supporter-group');
  const beforeJupiter=getSummary(game,definitions,balance).rates.D??0;
  const actionBefore=scaledOutput(game,definitions,observe.output).D??0;
  buy('target-jupiter');
  const afterJupiter=getSummary(game,definitions,balance).rates.D??0;
  const actionAfter=scaledOutput(game,definitions,observe.output).D??0;
  const beforeTelescope=afterJupiter;
  buy('additional-telescope');
  const afterTelescope=getSummary(game,definitions,balance).rates.D??0;
  buy('stable-mount'); buy('tracking'); buy('engineering'); buy('target-saturn');
  buy('supporter-group'); buy('supporter-group');
  buy('reflector'); buy('permanent-enclosure'); buy('camera'); buy('target-star-clusters');
  const beforeWorkstation=analysisYield(game,definitions,balance);
  buy('workstation');
  const afterWorkstation=analysisYield(game,definitions,balance);
  buy('academy'); const firstCourseSeconds=nextGraduate(); buy('appoint-fundraiser');
  const nextAfterFundraiser=getSummary(game,definitions,balance).guidance.nextId;
  buy('research'); buy('robotic-dome'); buy('teaching-qualification');
  nextGraduate(); buy('appoint-observer');
  const observingBeforeTeaching=getSummary(game,definitions,balance).rates.D;
  nextGraduate();
  const teacherCommand=/** @type {const} */({type:'buyInvestment',investmentId:'appoint-teacher'});
  wait(()=>quoteCommand(game,definitions,balance,teacherCommand).ok,true);
  advanceTicks(game,definitions,balance,20); // Buy off-cycle to exercise independent phases.
  const classroomBefore=[...game.state.academy.timers];
  send(teacherCommand);
  const classroomAfter=[...game.state.academy.timers];
  const teacherCourseSeconds=balance.course.seconds;
  nextGraduate();
  const observingWhileTeaching=getSummary(game,definitions,balance).rates.D;
  buy('operations-methods'); buy('analysis-methods'); buy('target-nebulae');
  buy('photometry');
  function nextPublication() {
    const before=game.state.science.publications;
    const started=game.state.clock.tick;
    wait(()=>game.state.science.publications+1e-9>=before+1);
    return (game.state.clock.tick-started)*TICK_SECONDS;
  }
  const observingBeforeStudies=getSummary(game,definitions,balance).rates.D;
  const firstStudySeconds=nextPublication();
  const fundingBeforeGrants=getSummary(game,definitions,balance).rates.F??0;
  buy('grant-office'); buy('observing-grant');
  const scientistCommand=/** @type {const} */({type:'buyInvestment',investmentId:'appoint-scientist'});
  wait(()=>quoteCommand(game,definitions,balance,scientistCommand).ok,true);
  advanceTicks(game,definitions,balance,20);
  const scienceBefore=getSummary(game,definitions,balance).rates.science??0;
  send(scientistCommand);
  const scienceAfter=getSummary(game,definitions,balance).rates.science??0;
  const scientistStudySeconds=1/scienceAfter;
  nextPublication(); buy('observing-grant');
  const fundingAfterGrants=getSummary(game,definitions,balance).rates.F??0;
  return {game,report:{milestones,classroomBefore,classroomAfter,scienceBefore,scienceAfter,firstStudySeconds,scientistStudySeconds,fundingBeforeGrants,fundingAfterGrants,observingBeforeStudies,publications:game.state.science.publications,grants:game.state.purchases['observing-grant'],instantKnowledge,processingRate,processingRateAfter,beforeJupiter,afterJupiter,actionBefore,actionAfter,beforeTelescope,afterTelescope,
    beforeWorkstation,afterWorkstation,nextAfterFundraiser,people:game.state.population.total,firstCourseSeconds,teacherCourseSeconds,
    observingBeforeTeaching,observingWhileTeaching,frontier:getSummary(game,definitions,balance).frontier.name,rates:getSummary(game,definitions,balance).rates}};
}
if (import.meta.main) console.log(JSON.stringify(runStationScenario().report,null,2));
