export type PlayerRace = 'UNDEAD' | 'HUMAN' | 'GOBLIN' | 'ELF' | 'ALL';
export type PlayerClass = 'FIGHTER' | 'CLERIC' | 'ASSASSIN' | 'THIEF';
export type UnitType =
  | 'CITIZEN'
  | 'WORKER'
  | 'OFFENSE'
  | 'DEFENSE'
  | 'SPY'
  | 'SENTRY';
export type ItemType =
  | 'WEAPON'
  | 'HELM'
  | 'ARMOR'
  | 'BOOTS'
  | 'BRACERS'
  | 'SHIELD';
export type BonusType =
  | 'ATTACK'
  | 'DEFENSE'
  | 'RECRUITING'
  | 'CASUALTY'
  | 'INTEL'
  | 'INCOME';

export type SidebarData = {
  gold: string;
  citizens: string;
  level: string;
  experience: string;
  xpToNextLevel: string;
  attackTurns: string;
  nextTurnTimestamp: string;
};

export type PlayerUnit = {
  level: number;
  type: UnitType;
  quantity: number;
};
export type PlayerItem = {
  level: number;
  type: ItemType;
  unitType: UnitType;
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
export type Weapon = {
  name: string;
  usage: UnitType;
  type: ItemType;
  level: number;
  bonus: number;
  cost: number;
  race: PlayerRace;
};
export type Fortification = {
  name: string;
  level: number;
  levelRequirement: number;
  hitpoints: number;
  costPerRepairPoint: number;
  goldPerTurn: number;
  defenseBonusPercentage: number;
  cost: number;
};
export type OffensiveUpgradeType = {
  name: string;
  fortLevelRequirement: number;
  offenseBonusPercentage: number;
  cost: number;
};
export type SpyUpgradeType = {
  name: string;
  fortLevelRequirement: number;
  offenseBonusPercentage: number;
  maxInfiltrations: number;
  maxAssassinations: number;
  cost: number;
};
export type SentryUpgradeType = {
  name: string;
  fortLevelRequirement: number;
  defenseBonusPercentage: number;
  cost: number;
};
export type PlayerBonus = {
  race: PlayerRace | PlayerClass;
  bonusType: BonusType;
  bonusAmount: number;
};
export type BankAccountType = 'HAND' | 'BANK';
/**
 * ECONOMY - Gold Per Turn added to the players account.
 * PLAYER_TRANSFER - Funds manually transferred by the player.
 * WAR_SPOILS - Gold via combat (or spying)
 */
export type BankTransferHistoryType =
  | 'ECONOMY'
  | 'PLAYER_TRANSFER'
  | 'WAR_SPOILS';
