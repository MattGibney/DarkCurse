export type PlayerRace = 'UNDEAD' | 'HUMAN' | 'GOBLIN' | 'ELF';
export type PlayerClass = 'FIGHTER' | 'CLERIC' | 'ASSASSIN' | 'THIEF';
export type CivilianUnit = {
  unitType: 'CITIZEN' | 'WORKER';
  quantity: number;
}
export type ArmyUnit = {
  unitLevel: 1 | 2 | 3;
  unitType: 'OFFENSE' | 'DEFENSE' | 'SPY' | 'SENTRY';
  quantity: number;
};
export type FortHealth = {
  current: number;
  max: number;
  percentage: number;
};
