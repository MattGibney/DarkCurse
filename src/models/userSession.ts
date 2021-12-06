import ModelFactory from '../modelFactory';
import DaoFactory from '../daoFactory';
import UserModel from './user';
import { UserSessionData } from '../daos/userSession';
import pino from 'pino';

class UserSessionModel {
  private modelFactory: ModelFactory;
  private daoFactory: DaoFactory;
  private logger: pino.Logger;

  public externalId: string;
  public userId: number;
  public sessionExpires: Date;

  constructor(modelFactory: ModelFactory, daoFactory: DaoFactory, logger: pino.Logger, userSessionData: UserSessionData) {
    this.modelFactory = modelFactory;
    this.daoFactory = daoFactory;
    this.logger = logger;

    this.sessionExpires = new Date();
    this.externalId = userSessionData.externalId;
    this.userId = userSessionData.userId;
  }

  get user(): Promise<UserModel> {
    return this.modelFactory.user.fetchById(
      this.modelFactory,
      this.daoFactory,
      this.logger,
      this.userId
    );
  }

  static async fetchByExternalId(modelFactory: ModelFactory, daoFactory: DaoFactory, logger: pino.Logger, externalId: string): Promise<UserSessionModel | null> {
    const sessionData = await daoFactory.userSession.fetchByExternalId(externalId);
    if (!sessionData) return null;
    return new UserSessionModel(modelFactory, daoFactory, logger, sessionData);
  }

  static async createSession(modelFactory: ModelFactory, daoFactory: DaoFactory, logger: pino.Logger, userId: number): Promise<UserSessionModel> {
    const sessionData = await daoFactory.userSession.createSession(userId);
    return new UserSessionModel(modelFactory, daoFactory, logger, sessionData);
  }
}

export default UserSessionModel;