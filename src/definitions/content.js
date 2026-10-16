import { resources } from './resources.js';
import { instrumentCosts, upgradeTuning } from './balance.js';

/** @type {import('../core/types.js').Definitions} */
export const definitions = {
  contentVersion: '0.2.0',
  resources,
  recipes: [], // Starter economic recipes are added in P3.
  // Later gates reserve resource-reveal IDs, not implemented production systems.
  gates: [
    { id: 'backyard', prerequisites: [] },
    { id: 'lunar-record', prerequisites: ['backyard'] },
    { id: 'planet-record', prerequisites: ['backyard'] },
    { id: 'outreach-milestone', prerequisites: ['outreach'] },
    { id: 'academy', prerequisites: ['camera', 'workstation'] },
    { id: 'teams', prerequisites: ['academy'] },
    { id: 'first-publication', prerequisites: ['teams'] },
    { id: 'campaign-closure', prerequisites: ['first-publication'] },
    { id: 'engineering', prerequisites: ['first-publication'] },
    { id: 'joint-science', prerequisites: ['engineering'] },
  ],
  instruments: [{
    id: 'starter-refractor', name: '60 mm founding refractor',
    tasks: ['moon', 'bright-planet'], purchasePrerequisites: [], cost: instrumentCosts['starter-refractor'],
  }, {
    id: 'reflector', name: '150–200 mm reflector', tasks: ['moon', 'bright-planet'],
    purchasePrerequisites: ['tracking', 'outreach-milestone'], cost: instrumentCosts.reflector,
  }],
  targets: [
    { id: 'moon', name: 'Moon', fictional: false, dataType: 'lunar-record',
      requiredInstrument: 'starter-refractor',
      sourceNote: 'Design plan sections 7.1 and 9: first observation is the Moon.',
      permittedClaim: 'Recorded an observation of the Moon.' },
    { id: 'bright-planet', name: 'Jupiter', fictional: false, dataType: 'planet-record',
      requiredInstrument: 'starter-refractor',
      sourceNote: 'Design plan section 7.1: a bright planet follows the lunar record.',
      permittedClaim: 'Recorded an observation of Jupiter.' },
  ],
  upgrades: [
    { ...upgradeTuning.outreach, id: 'outreach', name: 'Share the sky', persistence: 'permanentMethod',
      revealPrerequisites: ['lunar-record'], purchasePrerequisites: ['lunar-record'],
      panel: 'outreach' },
    { ...upgradeTuning['stable-mount'], id: 'stable-mount', name: 'Stable mount', persistence: 'installedHardware',
      revealPrerequisites: ['lunar-record', 'planet-record'], purchasePrerequisites: ['lunar-record', 'planet-record'],
      panel: 'infrastructure' },
    { ...upgradeTuning.tracking, id: 'tracking', name: 'Motorized tracking', persistence: 'permanentAutomation',
      revealPrerequisites: ['stable-mount'], purchasePrerequisites: ['stable-mount'],
      panel: 'infrastructure' },
    { ...upgradeTuning.camera, id: 'camera', name: 'Camera', persistence: 'installedHardware',
      revealPrerequisites: ['reflector'], purchasePrerequisites: ['reflector'],
      panel: 'infrastructure' },
    { ...upgradeTuning.workstation, id: 'workstation', name: 'Analysis workstation', persistence: 'installedHardware',
      revealPrerequisites: ['camera'], purchasePrerequisites: ['camera'],
      panel: 'analysis' },
    { ...upgradeTuning['analysis-throughput'], id: 'analysis-throughput', name: 'Analysis throughput', persistence: 'campaignOperation',
      revealPrerequisites: ['workstation'], purchasePrerequisites: ['workstation'],
      panel: 'analysis' },
  ],
};
