import * as express from 'express';
import { create } from 'express-handlebars';
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
  app.use(express.static('public'));
  app.use((req, res, next) => {
    const requestId = uuidv4();

    req.modelFactory = modelFactory;
    req.daoFactory = daoFactory;
    req.config = config;
    req.requestId = requestId;
    req.dateTime = new Date();
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
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());

  app.use(middleware.authenticate);

  app.use((req, res, next) => {
    if (req.user) {
      req.sidebarData = {
        gold: new Intl.NumberFormat('en-GB').format(req.user.gold),
        citizens: new Intl.NumberFormat('en-GB').format(req.user.citizens),
        level: new Intl.NumberFormat('en-GB').format(req.user.level),
        experience: new Intl.NumberFormat('en-GB').format(req.user.experience),
        xpToNextLevel: new Intl.NumberFormat('en-GB').format(
          req.user.xpToNextLevel
        ),
        attackTurns: new Intl.NumberFormat('en-GB').format(
          req.user.attackTurns
        ),
        nextTurnTimestamp:
          getTimeRemaining(getTimeToNextTurn()).minutes +
          ':' +
          getTimeRemaining(getTimeToNextTurn()).seconds,
      };
    }
    next();
  });

  // https://www.sitepoint.com/build-javascript-countdown-timer-no-dependencies/
  function getTimeRemaining(endtime) {
    const total = Date.parse(endtime) - new Date().getTime();
    const seconds = Math.floor((total / 1000) % 60);
    const minutes = Math.floor((total / 1000 / 60) % 60);
    const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
    const days = Math.floor(total / (1000 * 60 * 60 * 24));

    return {
      total,
      days,
      hours,
      minutes,
      seconds,
    };
  }

  function getTimeToNextTurn(date = new Date()) {
    const ms = 1800000; // 30mins in ms
    const nextTurn = new Date(Math.ceil(date.getTime() / ms) * ms);
    return nextTurn;
  }

  const hbs = create({
    extname: '.hbs',
    // Specify helpers which are only registered on this instance.
    helpers: {
      eq(arg1, arg2) {
        return arg1 === arg2;
      },
      isSelected(v1, v2) {
        if (v1 == v2) {
          return 'current ';
        }
      },
      isActive(v1, v2) {
        if (v1 == v2) {
          return 'active ';
        }
      },
    },
  });
  app.engine('.hbs', hbs.engine);
  app.set('view engine', '.hbs');
  app.set('views', 'src/views');

  app.use(router);

  return app;
};
