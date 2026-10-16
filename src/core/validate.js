import { requireValid, nonnegative, integer } from './schema.js';
export { ValidationError } from './schema.js';

/** @param {import('./types.js').Definitions} definitions */
export function validateDefinitions(definitions) {
  const ids = new Set();
  const known = new Set([...definitions.investments.map(item => item.id),'first-graduate','first-publication']);
  for (const item of definitions.investments) {
    requireValid(!ids.has(item.id),'definitions',`duplicate purchase ${item.id}`); ids.add(item.id);
    requireValid(definitions.stations.some(station => station.id === item.station),item.id,'unknown station');
    requireValid(item.requires.every(id => known.has(id)),item.id,'unknown prerequisite');
    integer(item.maxLevel,item.id); nonnegative(item.growth,item.id);
    requireValid(item.growth >= 1,item.id,'prices cannot decrease');
    for (const cost of Object.values(item.cost)) nonnegative(cost,item.id);
    for (const value of Object.values(item.output)) nonnegative(value,item.id);
  }
  for (const upgrade of definitions.insightUpgrades) {
    requireValid(upgrade.factor>1 && upgrade.growth>=1,upgrade.id,'Insight boosts and cost growth must increase');
    integer(upgrade.cost,upgrade.id); integer(upgrade.maxLevel,upgrade.id);
    requireValid(upgrade.cost>0,upgrade.id,'Insight price must be positive');
  }
  for (const program of definitions.programs) {
    requireValid(program.requires.every(id=>known.has(id)),program.id,'unknown prerequisite');
    requireValid(program.work>0,program.id,'work must be positive');
    integer(program.publications,program.id);
    for (const cost of Object.values(program.cost)) nonnegative(cost,program.id);
  }
}

/** @param {import('./types.js').Balance} balance */
export function validateBalance(balance) {
  for (const value of Object.values(balance.startingStocks)) nonnegative(value,'startingStocks');
  for (const value of Object.values(balance.course.cost)) nonnegative(value,'course.cost');
  requireValid(balance.course.work > 0 && balance.course.baseRate > 0,'course','work and rate must be positive');
  requireValid(balance.programRate>0,'programRate','must be positive');
  integer(balance.prestige.baseAward,'prestige.baseAward');
  requireValid(balance.prestige.baseAward>0,'prestige.baseAward','must be positive');
  integer(balance.actionCooldownTicks,'actionCooldownTicks');
  requireValid(balance.actionCooldownTicks > 0,'actionCooldownTicks','must be positive');
}
