import * as bcrypt from 'bcrypt';
import pino from 'pino';

import DaoFactory from '../daoFactory';
import { UserData } from '../daos/user';
import ModelFactory from '../modelFactory';
import { SidebarData } from '../../types/typings';
import { HouseUpgrades } from '../constants';

import {
  PlayerRace,
  PlayerClass,
  FortHealth,
  PlayerUnit,
  Unit,
  PlayerBonus,
  Weapon,
  PlayerItem,
} from '../../types/typings';
import {
  Fortifications,
  Levels,
  UnitTypes,
  Bonuses,
  WeaponTypes,
} from '../constants';

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
  public houseLevel: number;
  public attackTurns: number;
  public units: PlayerUnit[];
  public items: PlayerItem[];
  public last_active: Date;
  public rank: number;
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
    this.houseLevel = userData.houseLevel;

    this.attackTurns = userData.attackTurns;
    this.last_active = userData.last_active;
    this.units = userData.units;
    this.items = userData.items;
    this.rank = userData.rank;
  }

  get population() {
    return this.units.reduce((acc, unit) => acc + unit.quantity, 0);
  }

  get playerBonuses() {
    return Bonuses.filter(
      (bonus) => bonus.race === this.race || bonus.race === this.class
    );
  }

  get incomeBonus() {
    const income = Bonuses.filter(
      (bonus) =>
        (bonus.race === this.race || bonus.race === this.class) &&
        bonus.bonusType == 'INCOME'
    ).reduce(function (count, stat) {
      return count + stat.bonusAmount;
    }, 0);
    return income;
  }

  get attackBonus() {
    const attack = Bonuses.filter(
      (bonus) =>
        (bonus.race === this.race || bonus.race === this.class) &&
        bonus.bonusType == 'ATTACK'
    ).reduce(function (count, stat) {
      return count + stat.bonusAmount;
    }, 0);
    return attack;
  }

  get defenseBonus(): number {
    const defense = Bonuses.filter(
      (bonus) =>
        (bonus.race === this.race || bonus.race === this.class) &&
        bonus.bonusType == 'DEFENSE'
    ).reduce(function (count, stat) {
      return count + stat.bonusAmount;
    }, 0);
    return defense;
  }

  get intelBonus() {
    const intel = Bonuses.filter(
      (bonus) =>
        (bonus.race === this.race || bonus.race === this.class) &&
        bonus.bonusType == 'INTEL'
    ).reduce(function (count, stat) {
      return count + stat.bonusAmount;
    }, 0);
    return intel;
  }

  get recruitingBonus() {
    const recruiting = Bonuses.filter(
      (bonus) =>
        (bonus.race === this.race || bonus.race === this.class) &&
        bonus.bonusType == 'RECRUITING'
    ).reduce(function (count, stat) {
      return count + stat.bonusAmount;
    }, 0);
    const houseBonus = HouseUpgrades[this.houseLevel].citizensDaily;
    return parseInt(recruiting + houseBonus);
  }

  get casualtyBonus() {
    const casualty = Bonuses.filter(
      (bonus) =>
        (bonus.race === this.race || bonus.race === this.class) &&
        bonus.bonusType == 'CASUALTY'
    ).reduce(function (count, stat) {
      return count + stat.bonusAmount;
    }, 0);
    return casualty;
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
          ).bonus *
          unit.quantity *
          (1 + parseInt(this.incomeBonus.toString()) / 100)
      )
      .reduce((acc, gold) => acc + gold, 0);

    const fortificationGoldPerTurn = Fortifications[this.fortLevel].goldPerTurn;
    return workerGoldPerTurn + fortificationGoldPerTurn;
  }

  // TODO: refactor the below Off/Def/Spy/Sentry functions
  get offense(): number {
    const offenseUnits = this.units.filter((units) => units.type === 'OFFENSE');
    const offenseStat = offenseUnits
      .map((unit) => {
        return (
          UnitTypes.find(
            (unitType) =>
              unitType.type === unit.type && unitType.level === unit.level
          ).bonus *
          unit.quantity *
          (1 + parseInt(this.attackBonus.toString()) / 100)
        );
      })
      .reduce((acc, gold) => acc + gold, 0);

    return offenseStat;
  }

  get defense(): number {
    const offenseUnits = this.units.filter((units) => units.type === 'DEFENSE');
    let offenseStat = offenseUnits
      .map(
        (unit) =>
          UnitTypes.find(
            (unitType) =>
              unitType.type === unit.type && unitType.level === unit.level
          ).bonus *
          unit.quantity *
          (1 + parseInt(this.defenseBonus.toString()) / 100)
      )
      .reduce((acc, gold) => acc + gold, 0);

    const fortificationBonus =
      Fortifications[this.fortLevel].defenseBonusPercentage;
    offenseStat += offenseStat * fortificationBonus;
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
          ).bonus *
          unit.quantity *
          (1 + parseInt(this.intelBonus.toString()) / 100)
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
          ).bonus *
          unit.quantity *
          (1 + parseInt(this.intelBonus.toString()) / 100)
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

  get sideBarData(): SidebarData {
    return {
      gold: this.gold.toString(),
      citizens: this.citizens.toString(),
      level: this.level.toString(),
      experience: this.experience.toString(),
      xpToNextLevel: this.xpToNextLevel.toString(),
      attackTurns: this.attackTurns.toString(),
      nextTurnTimestamp:
        this.getTimeRemaining(this.getTimeToNextTurn()).minutes +
        ':' +
        this.getTimeRemaining(this.getTimeToNextTurn()).seconds,
    };
  }

  // https://www.sitepoint.com/build-javascript-countdown-timer-no-dependencies/
  getTimeRemaining(endtime) {
    const total = Date.parse(endtime) - new Date().getTime();
    const seconds = Math.floor((total / 1000) % 60);
    const minutes = Math.floor((total / 1000 / 60) % 60);
    const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
    const days = Math.floor(total / (1000 * 60 * 60 * 24));

    return {
      total,
      days,
      hours,
      minutes,
      seconds,
    };
  }

  getTimeToNextTurn(date = new Date()) {
    const ms = 1800000; // 30mins in ms
    const nextTurn = new Date(Math.ceil(date.getTime() / ms) * ms);
    return nextTurn;
  }

  /**
   * Limited to level one units only for now, until the upgrade system is
   * implemented.
   */
  get availableUnitTypes(): Unit[] {
    return UnitTypes.filter((unitType) => unitType.level <= this.fortLevel + 1);
  }

  get availableItemTypes(): Weapon[] {
    return WeaponTypes.filter(
      (unitType) => unitType.level <= this.fortLevel + 1
    );
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

  // Deprecated: see fetchAll, already part of the UserModel
  async fetchRank(id: number): Promise<number> {
    const user = await this.daoFactory.user.fetchRank(id);
    if (!user) return 0;
    return user;
  }

  //TODO: I'm not happy with this idea, feels like a good way to overwhelm the db
  async updateLastActive(): Promise<void> {
    await this.daoFactory.user.setLastActive(this.id);
  }

  async subtractTurns(amount: number): Promise<void> {
    this.attackTurns -= amount;
    await this.daoFactory.user.setTurns(this.id, this.attackTurns);
  }

  async addTurns(amount: number): Promise<void> {
    this.attackTurns += amount;
    await this.daoFactory.user.setTurns(this.id, this.attackTurns)
  }

  async addXP(amount: number): Promise<void> {
    this.experience += amount;
    await this.daoFactory.user.setXP(this.id, this.experience);
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
    // Add Citizens
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
