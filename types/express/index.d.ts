import pino from 'pino';
import { Config } from '../../config/environment';
import DaoFactory from '../../src/daoFactory';
import ModelFactory from '../../src/modelFactory';
import UserModel from '../../src/models/user';
import { SidebarData } from '../typings';

declare global {
  declare namespace Express {
    interface Request {
      modelFactory?: ModelFactory;
      daoFactory?: DaoFactory;
      config?: Config;
      user?: UserModel;
      logger: pino.Logger;
      requestId?: string;
      /**
       * This property was added to make testing easier. With it set here, we
       * avoid race conditions where tests run in-between miliseconds and
       * generate different dateTime objects.
       */
      dateTime: Date;
      sidebarData: SidebarData;
    }
  }
}
