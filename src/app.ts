import * as express from 'express';
import { engine } from 'express-handlebars'

import { Config } from '../config/environment';
import DaoFactory from './daoFactory';
import ModelFactory from './modelFactory';
import router from './router';

export default (config: Config): express.Application => {
  const app = express();

  app.use((req, res, next) => {
    req.modelFactory = new ModelFactory();
    req.daoFactory = new DaoFactory();

    next();
  });

  app.engine('.hbs', engine({extname: '.hbs'}));
  app.set('view engine', '.hbs');
  app.set("views", "src/views");

  app.use(router);

  return app;
}