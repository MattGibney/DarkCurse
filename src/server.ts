import pino from 'pino';
import * as cron from 'node-cron';
import knex from 'knex';

import application from './app';
import Config from '../config/environment';
import ModelFactory from './modelFactory';
import DaoFactory from './daoFactory';

const logger = pino({
  level: Config.loggingLevel,
  hooks: {
    logMethod(args, method) {
      if (args.length === 2) {
        args[0] = `${args[0]} %j`;
      }
      method.apply(this, args);
    },
  },
});

const database = knex({
  client: 'pg',
  connection: Config.PGConnectionString,
});

const modelFactory = new ModelFactory();
const daoFactory = new DaoFactory(database);

const app = application(Config, logger, modelFactory, daoFactory);

app.listen(Config.port, () => {
  console.log(`Server is running on port ${Config.port}`);
});

/**
 * There are a lot better ways to do this. For now, I want a simple system that
 * is easy to break out into a separate process or move to stand alone servers
 * if required.
 *
 * In the future, it would be a good idea to instead create a task runner that
 * can be started and stopped. It would also allow for more granular control
 * over things like retries when things go wrong.
 */
cron.schedule('0,30 * * * *', async () => {
  // Runs every 30 minutes.
  logger.info('Start: Processing game ticks');
  const allUsers = await modelFactory.user.fetchAll(
    modelFactory,
    daoFactory,
    logger
  );

  for await (const user of allUsers) {
    logger.info(`Processing user id:${user.id}`);

    // Add Gold
    logger.debug(`Adding gold per turn for id:${user.id}`);
    await user.addGold(user.goldPerTurn);
  }

  logger.info('Finish: Processing game ticks');
});
