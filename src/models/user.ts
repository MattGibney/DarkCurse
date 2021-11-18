import DaoFactory from '../daoFactory';
import { UserData } from '../daos/user';
import ModelFactory from '../modelFactory';
import WarHistoryModel from './warHistory';

import { PlayerRace, PlayerClass, ArmyUnit, CivilianUnit, FortHealth } from '../../types/typings';
import { Fortifications, WorkerProduction, Levels } from '../constants';

class UserModel {
  private modelFactory: ModelFactory;
  private daoFactory: DaoFactory;

  public id: number;
  public displayName: string;
  public race: PlayerRace;
  public class: PlayerClass;
  public experience: number;
  public gold: number;
  public goldInBank: number;
  public fortLevel: number;
  public fortHitpoints: number;

  public units: (ArmyUnit | CivilianUnit)[];

  constructor(
    modelFactory: ModelFactory,
    daoFactory: DaoFactory,
    userData: UserData
  ) {
    this.modelFactory = modelFactory;
    this.daoFactory = daoFactory;

    this.id = userData.id;
    this.displayName = userData.displayName;
    this.race = userData.race;
    this.class = userData.class;
    this.experience = userData.experience;
    this.gold = userData.gold;
    this.goldInBank = userData.goldInBank;

    this.fortLevel = userData.fortLevel;
    this.fortHitpoints = userData.fortHitpoints;

    this.units = userData.units;
  }

  get population() {
    return this.units.reduce((acc, unit) => acc + unit.quantity, 0);
  }

  get armySize(): number {
    return this.units
      .filter(
        (unit) => unit.unitType !== 'CITIZEN' && unit.unitType !== 'WORKER'
      )
      .reduce((acc, unit) => acc + unit.quantity, 0);
  }

  get goldPerTurn(): number {
    return this.units
      .find((units) => units.unitType === 'WORKER').quantity * WorkerProduction;
  }

  get offense(): number {
    return 0;
  }

  get level(): number {
    const possibleLevels = Object.values(Levels)
      .filter((levelXp) => this.experience > levelXp)
      .sort((a, b) => b - a);
    const xpOfCurrentLevel = possibleLevels[0];
    return Number(Object.entries(Levels).find(([level, xp]) => xp === xpOfCurrentLevel)[0]);
  }

  get xpToNextLevel(): number {
    const currentLevel = this.level;
    const nextLevelXP = Levels[currentLevel + 1];
    return nextLevelXP - this.experience;
  }

  get fortHealth(): FortHealth {
    return {
      current: this.fortHitpoints,
      max: Fortifications[this.fortLevel].hitpoints,
      percentage: Math.floor((this.fortHitpoints / Fortifications[this.fortLevel].hitpoints) * 100),
    }
  }

  // get attackLogs(): WarHistoryModel[] {
  //   return [];
  // }

  // get defendLogs(): WarHistoryModel[] {
  //   return [];
  // }

  // get spyLogs(): WarHistoryModel[] {
  //   return [];
  // }

  // get sentryLogs(): WarHistoryModel[] {
  //   return [];
  // }

  static async fetchById(modelFactory: ModelFactory, daoFactory: DaoFactory, id: number): Promise<UserModel> {
    const user = await daoFactory.user.fetchById(id);
    if (!user) return null;
    return new UserModel(modelFactory, daoFactory, user);
  }
}

export default UserModel;