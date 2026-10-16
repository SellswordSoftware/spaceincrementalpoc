/** @type {import('../core/types.js').ResourceDefinition[]} */
export const resources = [
  { id: 'F', name: 'Funding', kind: 'stock', reset: 'reset', spendable: true, revealAt: 'backyard' },
  { id: 'D', name: 'Data', kind: 'stock', reset: 'reset', spendable: true, revealAt: 'backyard' },
  { id: 'K', name: 'Knowledge', kind: 'stock', reset: 'reset', spendable: true, revealAt: 'backyard' },
  { id: 'I', name: 'Interest', kind: 'stock', reset: 'reset', spendable: true, revealAt: 'outreach' },
  { id: 'N', name: 'Trained people', kind: 'population', reset: 'reset', spendable: false, revealAt: 'academy' },
  { id: 'X', name: 'Expertise', kind: 'stock', reset: 'reset', spendable: true, revealAt: 'research' },
  { id: 'P', name: 'Publications', kind: 'achievement', reset: 'reset', spendable: false, revealAt: 'first-publication' },
  { id: 'E', name: 'Engineering Progress', kind: 'stock', reset: 'reset', spendable: true, revealAt: 'engineering' },
  { id: 'C', name: 'Collaboration Credits', kind: 'stock', reset: 'reset', spendable: true, revealAt: 'joint-science' },
  { id: 'Insight', name: 'Insight', kind: 'prestige', reset: 'retain', spendable: true, revealAt: 'campaign-closure' },
];
