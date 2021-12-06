export type PlayerRace = 'UNDEAD' | 'HUMAN' | 'GOBLIN' | 'ELF';
export type PlayerClass = 'FIGHTER' | 'CLERIC' | 'ASSASSIN' | 'THIEF';
export type UnitType = 'CITIZEN' | 'WORKER' | 'OFFENSE' | 'DEFENSE' | 'SPY' | 'SENTRY';
export type PlayerUnit = {
  level: number;
  type: UnitType;
  quantity: number;
};
export type FortHealth = {
  current: number;
  max: number;
  percentage: number;
};
export type Unit = {
  name: string;
  type: UnitType;
  level: number;
  bonus: number;
  cost: number;
};
