import pino from 'pino';
import { BankAccountType, BankTransferHistoryType } from '../../types/typings';
import DaoFactory from '../daoFactory';
import { BankHistoryData } from '../daos/bankHistory';
import ModelFactory from '../modelFactory';
import UserModel from './user';

class BankHistory {
  private modelFactory: ModelFactory;
  private daoFactory: DaoFactory;
  private logger: pino.Logger;

  public id: number;
  public goldAmount: number;
  public fromUserId: number;
  public fromUserAccount: BankAccountType;
  public toUserId: number;
  public toUserAccount: BankAccountType;
  public dateTime: Date;
  public historyType: BankTransferHistoryType;

  constructor(
    modelFactory: ModelFactory,
    daoFactory: DaoFactory,
    logger: pino.Logger,
    bankHistory: BankHistoryData
  ) {
    this.modelFactory = modelFactory;
    this.daoFactory = daoFactory;
    this.logger = logger;

    this.id = bankHistory.id;
    this.goldAmount = bankHistory.goldAmount;
    this.fromUserId = bankHistory.fromUserId;
    this.fromUserAccount = bankHistory.fromUserAccount;
    this.toUserId = bankHistory.toUserId;
    this.toUserAccount = bankHistory.toUserAccount;
    this.dateTime = bankHistory.dateTime;
    this.historyType = bankHistory.historyType;
  }

  static async fetchToUserHistory(
    modelFactory: ModelFactory,
    daoFactory: DaoFactory,
    logger: pino.Logger,
    toUser: UserModel
  ): Promise<BankHistory[]> {
    const historyForUser = await daoFactory.bankHistory.fetchToUserHistory(
      toUser.id
    );
    return historyForUser.map(
      (history) => new BankHistory(modelFactory, daoFactory, logger, history)
    );
  }

  static async fetchToUserHistoryForLastTwentyFourHours(
    modelFactory: ModelFactory,
    daoFactory: DaoFactory,
    logger: pino.Logger,
    toUser: UserModel
  ): Promise<BankHistory[]> {
    const historyForUser = await daoFactory.bankHistory.fetchToUserHistory(
      toUser.id
    );
    const yesterday = new Date(new Date().getTime() - 24 * 60 * 60 * 1000);
    const last24hours = historyForUser.filter(
      (history) => history.dateTime > yesterday
    );
    return last24hours.map(
      (history) => new BankHistory(modelFactory, daoFactory, logger, history)
    );
  }

  static async createHistory(
    modelFactory: ModelFactory,
    daoFactory: DaoFactory,
    logger: pino.Logger,
    historyData: BankHistoryData
  ): Promise<BankHistory> {
    const newHistoryData = await daoFactory.bankHistory.createHistory(
      historyData
    );
    return new BankHistory(modelFactory, daoFactory, logger, newHistoryData);
  }
}

export default BankHistory;
