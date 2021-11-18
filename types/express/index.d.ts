import DaoFactory from '../../src/daoFactory';
import ModelFactory from '../../src/modelFactory';

declare global {
  declare namespace Express {
    interface Request {
      modelFactory?: ModelFactory;
      daoFactory?: DaoFactory;
    }
  }
}