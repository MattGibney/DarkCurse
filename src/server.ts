import pino from 'pino';

import application from './app';
import Config from '../config/environment';

const logger = pino({
  level: Config.loggingLevel,
  hooks: { 
    logMethod (args, method) {
      if (args.length === 2) {
        args[0] = `${args[0]} %j`
      }
      method.apply(this, args)
    }
  }
});

const app = application(Config, logger);

app.listen(Config.port, () => {
  console.log(`Server is running on port ${Config.port}`);
});
