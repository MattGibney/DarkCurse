import * as express from 'express';
import { Config } from '../config/environment';

export default (config: Config): express.Application => {
  const app = express();

  app.get('/', (req, res) => {
    res.send('Hello World!');
  });

  return app;
}