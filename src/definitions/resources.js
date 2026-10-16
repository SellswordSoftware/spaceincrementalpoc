/** @type {import('../core/types.js').ResourceDefinition[]} */
export const resources = [
  { id: 'F', name: 'Funding', kind: 'stock', reset: 'reset', spendable: true, revealAt: 'backyard' },
  { id: 'D', name: 'Observation Data', kind: 'typedInventory', reset: 'reset', spendable: false, revealAt: 'backyard' },
  { id: 'K', name: 'Knowledge', kind: 'stock', reset: 'reset', spendable: true, revealAt: 'backyard' },
  { id: 'I', name: 'Public Interest', kind: 'stock', reset: 'reset', spendable: false, revealAt: 'outreach' },
  { id: 'N', name: 'Trained people', kind: 'population', reset: 'retain', spendable: false, revealAt: 'academy' },
  { id: 'X', name: 'Expertise', kind: 'stock', reset: 'reset', spendable: true, revealAt: 'teams' },
  { id: 'P', name: 'Publications', kind: 'achievement', reset: 'reset', spendable: false, revealAt: 'first-publication' },
  { id: 'E', name: 'Engineering Progress', kind: 'stock', reset: 'reset', spendable: true, revealAt: 'engineering' },
  { id: 'C', name: 'Collaboration Credits', kind: 'stock', reset: 'reset', spendable: true, revealAt: 'joint-science' },
  { id: 'L', name: 'Legacy', kind: 'legacy', reset: 'retain', spendable: true, revealAt: 'campaign-closure' },
];

export const persistenceClasses = /** @type {const} */ ([
  'installedHardware', 'permanentMethod', 'permanentAutomation', 'permanentQualification',
  'campaignOperation', 'campaignSpecialization', 'campaignCollaboration', 'legacy',
]);
