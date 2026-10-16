/** @param {import('./types.js').GameState} game @param {import('./types.js').Definitions} definitions */
export function populationSummary(game, definitions) {
  const appointed = definitions.investments.filter(item => item.kind === 'appointment')
    .reduce((sum,item) => sum + (game.state.purchases[item.id] ?? 0),0);
  return {total:game.state.population.total,appointed,available:game.state.population.total-appointed};
}
