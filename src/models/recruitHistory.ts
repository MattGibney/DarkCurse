import pino from 'pino';
import DaoFactory from '../daoFactory';
import { RecruitHistoryRow, RecruitHistoryDao } from '../daos/recruitHistory';
import ModelFactory from '../modelFactory';
import UserModel from './user';

export class RecruitHistory {
  private modelFactory: ModelFactory;
  private daoFactory: DaoFactory;
  private logger: pino.Logger;

  public id: number;
  public to_user: number;
  public from_user: number;
  public ip_addr: string;
  public timestamp: Date;

  constructor(
    modelFactory: ModelFactory,
    daoFactory: DaoFactory,
    logger: pino.Logger,
    attackLog: RecruitHistoryRow
  ) {
    this.modelFactory = modelFactory;
    this.daoFactory = daoFactory;
    this.logger = logger;

    this.id = attackLog.id;
    this.to_user = attackLog.to_user;
    this.from_user = attackLog.from_user;
    this.timestamp = new Date(attackLog.timestamp);
    this.ip_addr = attackLog.ip_addr;
  }

  static async fetchByID(
    modelFactory: ModelFactory,
    daoFactory: DaoFactory,
    logger: pino.Logger,
    battleID: number
  ): Promise<RecruitHistoryRow> {
    return await daoFactory.recruitHistory.fetchById(battleID);
  }

  static async fetchToUserHistory(
    modelFactory: ModelFactory,
    daoFactory: DaoFactory,
    logger: pino.Logger,
    toUser: UserModel
  ): Promise<RecruitHistory[]> {
    const historyForUser = await daoFactory.recruitHistory.fetchToUserHistory(
      toUser.id
    );
    return historyForUser.map(
      (history) => new RecruitHistory(modelFactory, daoFactory, logger, history)
    );
  }

  static async fetchCountClicksByIP(
    modelFactory: ModelFactory,
    daoFactory: DaoFactory,
    logger: pino.Logger,
    ip_addr: string
  ): Promise<number> {
    const count = await daoFactory.recruitHistory.fetchCountClicksByIP(ip_addr);
    return count;
  }

  static async fetchCountClicksToID(
    modelFactory: ModelFactory,
    daoFactory: DaoFactory,
    logger: pino.Logger,
    user_id: number
  ): Promise<number> {
    const count = await daoFactory.recruitHistory.fetchCountClicksToID(user_id);
    return count;
  }

  static async createHistory(
    modelFactory: ModelFactory,
    daoFactory: DaoFactory,
    logger: pino.Logger,
    historyData: RecruitHistoryRow
  ): Promise<RecruitHistory> {
    const newHistoryData = await daoFactory.recruitHistory.createHistory(
      historyData
    );
    return new RecruitHistory(modelFactory, daoFactory, logger, newHistoryData);
  }
}

export default RecruitHistory;
