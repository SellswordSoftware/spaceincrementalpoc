/** @typedef {import('./types.js').GameState} GameState */

/** Append or merge a continuous observation lot, retaining acquisition provenance.
 * @param {GameState} game @param {import('./types.js').Definitions} definitions
 * @param {{targetId:string, instrumentId:string, mode:'visual'|'camera', quantity:number}} observation
 */
export function recordObservation(game, definitions, observation) {
  if (observation.quantity <= 0) return;
  const tick = game.state.clock.tick;
  const target = definitions.targets.find(target => target.id === observation.targetId);
  if (!target) throw new Error(`Unknown target ${observation.targetId}`);
  const previous = game.state.data.findLast(lot => lot.targetId === target.id && lot.instrumentId === observation.instrumentId
    && lot.mode === observation.mode && lot.type === target.dataType && lot.endTick >= tick);
  if (previous) {
    previous.quantity += observation.quantity;
    previous.endTick = tick + 1;
  } else {
    game.state.data.push({ id: `data-${observation.instrumentId}-${target.id}-${tick}`, targetId: target.id,
      type: target.dataType, instrumentId: observation.instrumentId, mode: observation.mode,
      startTick: tick, endTick: tick + 1, quantity: observation.quantity, consumed: 0 });
  }
}

/** Analysis consumes each raw packet once and jointly produces linked evidence.
 * @param {GameState} game @param {{lotId:string, quantity:number}[]} reservations
 */
export function processData(game, reservations) {
  for (const reservation of reservations) {
    const lot = game.state.data.find(lot => lot.id === reservation.lotId);
    if (!lot) throw new Error(`Missing reserved data ${reservation.lotId}`);
    lot.consumed = Math.min(lot.quantity, lot.consumed + reservation.quantity);
    const evidence = game.state.investigations.evidence.find(item => item.lotId === lot.id);
    if (evidence) {
      evidence.quantity += reservation.quantity;
      evidence.endTick = lot.endTick;
    } else {
      game.state.investigations.evidence.push({ lotId: lot.id, targetId: lot.targetId, type: lot.type,
        mode: lot.mode, startTick: lot.startTick, endTick: lot.endTick, quantity: reservation.quantity, allocated: 0 });
    }
  }
}

/** @param {GameState} game @param {import('./types.js').MilestoneCondition} condition */
export function meetsMilestone(game, condition) {
  if (condition.kind === 'interest') return game.state.campaign.interestEarned + 1e-9 >= condition.quantity;
  const amount = game.state.investigations.evidence.filter(item => item.targetId === condition.targetId)
    .reduce((sum, item) => sum + item.quantity, 0);
  return amount + 1e-9 >= condition.quantity;
}
