import pino from 'pino';
import { Config } from '../../config/environment';
import DaoFactory from '../../src/daoFactory';
import ModelFactory from '../../src/modelFactory';
import UserModel from '../../src/models/user';

declare global {
  declare namespace Express {
    interface Request {
      modelFactory?: ModelFactory;
      daoFactory?: DaoFactory;
      config?: Config;
      user?: UserModel;
      logger: pino.Logger;
      requestId?: string;
    }
  }
}