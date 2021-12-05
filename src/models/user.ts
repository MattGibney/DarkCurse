import * as bcrypt from 'bcrypt';
import pino from 'pino';

import DaoFactory from '../daoFactory';
import { UserData } from '../daos/user';
import ModelFactory from '../modelFactory';
import WarHistoryModel from './warHistory';

import { PlayerRace, PlayerClass, FortHealth, PlayerUnit, Unit } from '../../types/typings';
import { Fortifications, WorkerProduction, Levels, UnitTypes } from '../constants';

class UserModel {
  private modelFactory: ModelFactory;
  private daoFactory: DaoFactory;
  private logger: pino.Logger;

  public id: number;
  public displayName: string;
  public email: string;
  public passwordHash: string;
  public race: PlayerRace;
  public class: PlayerClass;
  public experience: number;
  public gold: number;
  public goldInBank: number;
  public fortLevel: number;
  public fortHitpoints: number;

  public attackTurns: number;

  public units: PlayerUnit[];

  constructor(
    modelFactory: ModelFactory,
    daoFactory: DaoFactory,
    logger: pino.Logger,
    userData: UserData
  ) {
    this.modelFactory = modelFactory;
    this.daoFactory = daoFactory;
    this.logger = logger;

    this.id = userData.id;
    this.displayName = userData.displayName;
    this.email = userData.email;
    this.passwordHash = userData.passwordHash;
    this.race = userData.race;
    this.class = userData.class;
    this.experience = userData.experience;
    this.gold = userData.gold;
    this.goldInBank = userData.goldInBank;

    this.fortLevel = userData.fortLevel;
    this.fortHitpoints = userData.fortHitpoints;

    this.attackTurns = userData.attackTurns;

    this.units = userData.units;
  }

  get population() {
    return this.units.reduce((acc, unit) => acc + unit.quantity, 0);
  }

  get armySize(): number {
    return this.units
      .filter(
        (unit) => unit.type !== 'CITIZEN' && unit.type !== 'WORKER'
      )
      .reduce((acc, unit) => acc + unit.quantity, 0);
  }

  get citizens(): number {
    return this.units
      .find((unit) => unit.type === 'CITIZEN').quantity;
  }

  get goldPerTurn(): number {
    const workerUnits = this.units
      .find((units) => units.type === 'WORKER');
    if(!workerUnits) return 0;
    return workerUnits.quantity * WorkerProduction;
  }

  get offense(): number {
    return 0;
  }

  get level(): number {
    if (this.experience === 0) return 1;

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

  /**
   * Limited to level one units only for now, until the upgrade system is
   * implemented.
   */
  get availableUnitTypes(): Unit[] {
    return UnitTypes.filter((unitType) => unitType.level === 1);
  }

  async validatePassword(password: string): Promise<boolean> {
    return await bcrypt.compare(password, this.passwordHash);
  }

  async subtractGold(amount: number): Promise<void> {
    this.gold -= amount;
    await this.daoFactory.user.setGold(this.id, this.gold);
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

  static async fetchById(modelFactory: ModelFactory, daoFactory: DaoFactory, logger: pino.Logger, id: number): Promise<UserModel> {
    const user = await daoFactory.user.fetchById(id);
    if (!user) return null;
    return new UserModel(modelFactory, daoFactory, logger, user);
  }

  static async fetchByEmail(modelFactory: ModelFactory, daoFactory: DaoFactory, logger: pino.Logger, email: string): Promise<UserModel> {
    const user = await daoFactory.user.fetchByEmail(email);
    if (!user) return null;
    return new UserModel(modelFactory, daoFactory, logger, user);
  }

  static async fetchAll(modelFactory: ModelFactory, daoFactory: DaoFactory, logger: pino.Logger): Promise<UserModel[]> {
    const users = await daoFactory.user.fetchAll();
    return users.map((user) => new UserModel(modelFactory, daoFactory, logger, user));
  }
}

export default UserModel;