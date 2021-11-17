import ModelFactory from './src/modelFactory';
import DaoFactory from './src/daoFactory';

declare global {
  namespace Express {
    export interface Request {
      modelFactory?: ModelFactory;
      daoFactory?: DaoFactory;
    }
  }
}