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

export default (
  config: Config,
  logger: pino.Logger,
  modelFactory: ModelFactory,
  daoFactory: DaoFactory
): express.Application => {
  const app = express();

  

  app.use((req, res, next) => {
    const requestId = uuidv4();

    req.modelFactory = modelFactory;
    req.daoFactory = daoFactory;
    req.config = config;
    req.requestId = requestId;
    req.logger = logger.child({ requestId });

    res.setHeader('X-Request-Id', requestId);
    res.setHeader('X-Powered-By', `Dark Curse ${config.version}`);
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

  app.use((req, res, next) => {
    req.sidebarData = {
      gold: new Intl.NumberFormat('en-GB').format(req.user.gold),
      citizens: new Intl.NumberFormat('en-GB').format(req.user.citizens),
      level: new Intl.NumberFormat('en-GB').format(req.user.level),
      experience: new Intl.NumberFormat('en-GB').format(req.user.experience),
      xpToNextLevel: new Intl.NumberFormat('en-GB').format(req.user.xpToNextLevel),
      attackTurns: new Intl.NumberFormat('en-GB').format(req.user.attackTurns),
    };
    next();
  });

  app.engine('.hbs', engine({extname: '.hbs'}));
  app.set('view engine', '.hbs');
  app.set("views", "src/views");

  app.use(router);

  return app;
}