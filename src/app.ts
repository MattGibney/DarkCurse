import * as express from 'express';
import { Config } from '../config/environment';
import DaoFactory from './daoFactory';
import ModelFactory from './modelFactory';

export default (config: Config): express.Application => {
  const app = express();

  app.use((req, res, next) => {
    req.modelFactory = new ModelFactory();
    req.daoFactory = new DaoFactory();

    next();
  });

  app.get('/', (req, res) => {
    res.send('Hello World!');
  });

  return app;
}