import * as bcrypt from 'bcrypt';
import pino from 'pino';

import DaoFactory from '../daoFactory';
import { UserData } from '../daos/user';
import ModelFactory from '../modelFactory';

import {
  PlayerRace,
  PlayerClass,
  FortHealth,
  PlayerUnit,
  Unit,
} from '../../types/typings';
import { Fortifications, Levels, UnitTypes } from '../constants';

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
  public last_active: Date;

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
      .filter((unit) => unit.type !== 'CITIZEN' && unit.type !== 'WORKER')
      .reduce((acc, unit) => acc + unit.quantity, 0);
  }

  get citizens(): number {
    return this.units.find((unit) => unit.type === 'CITIZEN').quantity;
  }

  get goldPerTurn(): number {
    const workerUnits = this.units.filter((units) => units.type === 'WORKER');
    const workerGoldPerTurn = workerUnits
      .map(
        (unit) =>
          UnitTypes.find(
            (unitType) =>
              unitType.type === unit.type && unitType.level === unit.level
          ).bonus * unit.quantity
      )
      .reduce((acc, gold) => acc + gold, 0);

    const fortificationGoldPerTurn = Fortifications[this.fortLevel].goldPerTurn;
    return workerGoldPerTurn + fortificationGoldPerTurn;
  }

  // TODO: refactor the below Off/Def/Spy/Sentry functions
  get offense(): number {
    const offenseUnits = this.units.filter((units) => units.type === 'OFFENSE');
    const offenseStat = offenseUnits
      .map(
        (unit) =>
          UnitTypes.find(
            (unitType) =>
              unitType.type === unit.type && unitType.level === unit.level
          ).bonus * unit.quantity
      )
      .reduce((acc, gold) => acc + gold, 0);

    return offenseStat;
  }

  get defense(): number {
    const offenseUnits = this.units.filter((units) => units.type === 'DEFENSE');
    const offenseStat = offenseUnits
      .map(
        (unit) =>
          UnitTypes.find(
            (unitType) =>
              unitType.type === unit.type && unitType.level === unit.level
          ).bonus * unit.quantity
      )
      .reduce((acc, gold) => acc + gold, 0);

    return offenseStat;
  }

  get sentry(): number {
    const offenseUnits = this.units.filter((units) => units.type === 'SENTRY');
    const offenseStat = offenseUnits
      .map(
        (unit) =>
          UnitTypes.find(
            (unitType) =>
              unitType.type === unit.type && unitType.level === unit.level
          ).bonus * unit.quantity
      )
      .reduce((acc, gold) => acc + gold, 0);

    return offenseStat;
  }

  get spy(): number {
    const offenseUnits = this.units.filter((units) => units.type === 'SENTRY');
    const offenseStat = offenseUnits
      .map(
        (unit) =>
          UnitTypes.find(
            (unitType) =>
              unitType.type === unit.type && unitType.level === unit.level
          ).bonus * unit.quantity
      )
      .reduce((acc, gold) => acc + gold, 0);

    return offenseStat;
  }

  get level(): number {
    if (this.experience === 0) return 1;

    const possibleLevels = Object.values(Levels)
      .filter((levelXp) => this.experience > levelXp)
      .sort((a, b) => b - a);
    const xpOfCurrentLevel = possibleLevels[0];
    return Number(
      Object.entries(Levels).find(([, xp]) => xp === xpOfCurrentLevel)[0]
    );
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
      percentage: Math.floor(
        (this.fortHitpoints / Fortifications[this.fortLevel].hitpoints) * 100
      ),
    };
  }

  /**
   * Limited to level one units only for now, until the upgrade system is
   * implemented.
   */
  get availableUnitTypes(): Unit[] {
    return UnitTypes.filter((unitType) => unitType.level === 1);
  }

  get maximumBankDeposits(): number {
    return 1;
  }

  /**
   * Uses banking transactional history to determine available deposits.
   */
  async fetchAvailableBankDeposits(): Promise<number> {
    // Used in the last 24 hours.
    const depositsUsed =
      await this.modelFactory.bankHistory.fetchToUserHistoryForLastTwentyFourHours(
        this.modelFactory,
        this.daoFactory,
        this.logger,
        this
      );
    // We only want to include transfers from the player's own hand to their
    // bank
    const bankingActions = depositsUsed.filter(
      (history) =>
        history.fromUserId === this.id &&
        history.fromUserAccount === 'HAND' &&
        history.historyType === 'PLAYER_TRANSFER'
    );
    return this.maximumBankDeposits - bankingActions.length;
  }

  async validatePassword(password: string): Promise<boolean> {
    return await bcrypt.compare(password, this.passwordHash);
  }

  static async createUser(
    email: string,
    password: string,
    race: string,
    class_name: string,
    display_name: string,
    daoFactory: DaoFactory
  ): Promise<UserData> {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    return await daoFactory.user.createUser(
      email,
      hash,
      salt,
      race,
      class_name,
      display_name
    );
  }

  //TODO: I'm not happy with this idea, feels like a good way to overwhelm the db
  async updateLastActive(): Promise<void> {
    console.log(this.id);
    await this.daoFactory.user.setLastActive(this.id);
  }

  async addGold(amount: number): Promise<void> {
    this.gold += amount;
    await this.daoFactory.user.setGold(this.id, this.gold);
  }

  async subtractGold(amount: number): Promise<void> {
    this.gold -= amount;
    await this.daoFactory.user.setGold(this.id, this.gold);
  }

  async addBankedGold(amount: number): Promise<void> {
    this.goldInBank += amount;
    await this.daoFactory.user.setBankedGold(this.id, this.goldInBank);
  }

  async subtractBankedGold(amount: number): Promise<void> {
    this.goldInBank -= amount;
    await this.daoFactory.user.setBankedGold(this.id, this.goldInBank);
  }

  /**
   * Takes in an object containing the details of the desired units. It then
   * merges the objects, if a unit already exists, it will add the quantity
   * if it's a new unit. It'll be added directly.
   *
   * TODO: This is a rather in-elegant approach. Make it better.
   */
  async untrainNewUnits(newUnits: PlayerUnit[]): Promise<void> {
    // Add New Citizens
    const totalNewUnits = newUnits.reduce(
      (acc, unit) => acc + unit.quantity,
      0
    );
    const citizenUnits = this.units.find((unit) => unit.type === 'CITIZEN');
    citizenUnits.quantity += totalNewUnits;

    // Update existing units
    const unitsToUpdate = this.units.filter((unit) =>
      newUnits.find(
        (newUnit) => newUnit.type === unit.type && newUnit.level === unit.level
      )
    );
    unitsToUpdate.forEach((unit) => {
      const newUnit = newUnits.find(
        (newUnit) => newUnit.type === unit.type && newUnit.level === unit.level
      );
      unit.quantity -= newUnit.quantity;
    });

    this.units = Object.assign(unitsToUpdate, this.units);

    // Subtract old units
    const newUnitsToAdd = newUnits.filter(
      (newUnit) =>
        !this.units.find(
          (unit) => unit.type === newUnit.type && unit.level === newUnit.level
        )
    );
    this.units = this.units.concat(newUnitsToAdd);

    await this.daoFactory.user.setUnits(this.id, this.units);
  }

  /**
   * Takes in an object containing the details of the desired units. It then
   * merges the objects, if a unit already exists, it will add the quantity
   * if it's a new unit. It'll be added directly.
   *
   * TODO: This is a rather in-elegant approach. Make it better.
   */
  async trainNewUnits(newUnits: PlayerUnit[]): Promise<void> {
    // Subtract Citizens
    const totalNewUnits = newUnits.reduce(
      (acc, unit) => acc + unit.quantity,
      0
    );
    const citizenUnits = this.units.find((unit) => unit.type === 'CITIZEN');
    citizenUnits.quantity -= totalNewUnits;

    // Update existing units
    const unitsToUpdate = this.units.filter((unit) =>
      newUnits.find(
        (newUnit) => newUnit.type === unit.type && newUnit.level === unit.level
      )
    );
    unitsToUpdate.forEach((unit) => {
      const newUnit = newUnits.find(
        (newUnit) => newUnit.type === unit.type && newUnit.level === unit.level
      );
      unit.quantity += newUnit.quantity;
    });

    this.units = Object.assign(unitsToUpdate, this.units);

    // Add new units
    const newUnitsToAdd = newUnits.filter(
      (newUnit) =>
        !this.units.find(
          (unit) => unit.type === newUnit.type && unit.level === newUnit.level
        )
    );
    this.units = this.units.concat(newUnitsToAdd);

    await this.daoFactory.user.setUnits(this.id, this.units);
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

  static async fetchById(
    modelFactory: ModelFactory,
    daoFactory: DaoFactory,
    logger: pino.Logger,
    id: number
  ): Promise<UserModel> {
    const user = await daoFactory.user.fetchById(id);
    if (!user) return null;
    return new UserModel(modelFactory, daoFactory, logger, user);
  }

  static async fetchByEmail(
    modelFactory: ModelFactory,
    daoFactory: DaoFactory,
    logger: pino.Logger,
    email: string
  ): Promise<UserModel> {
    const user = await daoFactory.user.fetchByEmail(email);
    if (!user) return null;
    return new UserModel(modelFactory, daoFactory, logger, user);
  }

  static async fetchByDisplayName(
    modelFactory: ModelFactory,
    daoFactory: DaoFactory,
    logger: pino.Logger,
    display_name: string
  ): Promise<UserModel> {
    const user = await daoFactory.user.fetchByDisplayName(display_name);
    if (!user) return null;
    return new UserModel(modelFactory, daoFactory, logger, user);
  }

  static async fetchAll(
    modelFactory: ModelFactory,
    daoFactory: DaoFactory,
    logger: pino.Logger
  ): Promise<UserModel[]> {
    const users = await daoFactory.user.fetchAll();
    return users.map(
      (user) => new UserModel(modelFactory, daoFactory, logger, user)
    );
  }
}

export default UserModel;
