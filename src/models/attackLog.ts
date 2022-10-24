import pino from 'pino';
import DaoFactory from '../daoFactory';
import { AttackLogData, AttackLogStats } from '../daos/attackLog';
import ModelFactory from '../modelFactory';
import UserModel from './user';

class AttackLog {
  private modelFactory: ModelFactory;
  private daoFactory: DaoFactory;
  private logger: pino.Logger;

  public id: number;
  public winner: number;
  public attacker_id: number;
  public defender_id: number;
  public timestamp: Date;
  public stats: AttackLogStats[];

  constructor(
    modelFactory: ModelFactory,
    daoFactory: DaoFactory,
    logger: pino.Logger,
    attackLog: AttackLogData
  ) {
    this.modelFactory = modelFactory;
    this.daoFactory = daoFactory;
    this.logger = logger;

    this.id = attackLog.id;
    this.winner = attackLog.winner;
    this.attacker_id = attackLog.attacker_id;
    this.defender_id = attackLog.defender_id;
    this.timestamp = attackLog.timestamp;
    this.stats = attackLog.stats;
  }

  static async fetchByID(
    modelFactory: ModelFactory,
    daoFactory: DaoFactory,
    logger: pino.Logger,
    battleID: number
  ): Promise<AttackLogData> {
    return await daoFactory.attackLog.fetchById(battleID);
  }

  static async fetchUserOffenseHistory(
    modelFactory: ModelFactory,
    daoFactory: DaoFactory,
    logger: pino.Logger,
    toUser: UserModel
  ): Promise<AttackLog[]> {
    const historyForUser = await daoFactory.attackLog.fetchUserOffenseHistory(
      toUser.id
    );
    return historyForUser.map(
      (history) => new AttackLog(modelFactory, daoFactory, logger, history)
    );
  }

  static async fetchUserDefenseHistory(
    modelFactory: ModelFactory,
    daoFactory: DaoFactory,
    logger: pino.Logger,
    toUser: UserModel
  ): Promise<AttackLog[]> {
    const historyForUser = await daoFactory.attackLog.fetchUserDefenseHistory(
      toUser.id
    );
    return historyForUser.map(
      (history) => new AttackLog(modelFactory, daoFactory, logger, history)
    );
  }

  static async canAttackUser(
    modelFactory: ModelFactory,
    daoFactory: DaoFactory,
    logger: pino.Logger,
    toUser: UserModel,
    fromUser: UserModel
  ): Promise<boolean> {
    const numberOfAttacks =
      await daoFactory.attackLog.countAttacksToUserByUser24Hours(
        fromUser.id,
        toUser.id
      );
    console.log(numberOfAttacks);
    return numberOfAttacks >= 5 ? false : true;
  }

  static async createHistory(
    modelFactory: ModelFactory,
    daoFactory: DaoFactory,
    logger: pino.Logger,
    historyData: AttackLogData
  ): Promise<AttackLog> {
    const newHistoryData = await daoFactory.attackLog.createHistory(
      historyData
    );
    return new AttackLog(modelFactory, daoFactory, logger, newHistoryData);
  }
}

export default AttackLog;
