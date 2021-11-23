import * as express from 'express';
import { engine } from 'express-handlebars';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import { v4 as uuidv4 } from 'uuid';
import pino from 'pino';

import { Config } from '../config/environment';
import DaoFactory from './daoFactory';
import ModelFactory from './modelFactory';
import router from './router';
import middleware from './middleware';

export default (config: Config): express.Application => {
  const app = express();
  const logger = pino({
    level: config.loggingLevel,
  });

  app.use((req, res, next) => {
    const requestId = uuidv4();

    req.modelFactory = new ModelFactory();
    req.daoFactory = new DaoFactory();
    req.config = config;
    req.requestId = requestId;
    req.logger = logger.child({ requestId });

    res.setHeader('X-Request-Id', requestId);
    res.on('finish', () => {
      req.logger.info({
        method: req.method,
        url: req.url,
        statusCode: res.statusCode,
      });
    });

    next();
  });

  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(cookieParser());

  app.use(middleware.authenticate);

  app.engine('.hbs', engine({extname: '.hbs'}));
  app.set('view engine', '.hbs');
  app.set("views", "src/views");

  app.use(router);

  return app;
}