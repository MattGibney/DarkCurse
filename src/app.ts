import * as express from 'express';
import { engine } from 'express-handlebars';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import * as jsonwebtoken from 'jsonwebtoken';

import { Config } from '../config/environment';
import DaoFactory from './daoFactory';
import ModelFactory from './modelFactory';
import router from './router';

export default (config: Config): express.Application => {
  const app = express();

  app.use((req, res, next) => {
    req.modelFactory = new ModelFactory();
    req.daoFactory = new DaoFactory();
    req.config = config;

    next();
  });

  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(cookieParser());

  app.use(async (req, res, next) => {
    req.user = await req.modelFactory.user.fetchById(
      req.modelFactory,
      req.daoFactory,
      1
    );
    // const JWTCookie = req.cookies['DCT'];
    // if (!JWTCookie) {
    //   // console.log('Request does not contain a JWT');
      
    //   // req.Logger.debug('Request does not contain a JWT');
    //   next();
    //   return;
    // }

    // // console.log('JWT', JWTCookie);
    
  
    // let sessionId;
    // try {
    //   const decodedToken = jsonwebtoken.verify(JWTCookie, req.config.jwtSecret);
    //   sessionId = decodedToken.valueOf()['id'];
    // } catch (error) {
    //   // req.Logger.error('Request JWT invalid', { error: error.message });
    //   // console.log('Request JWT invalid', { error: error.message });
      
    //   next();
    //   return;
    // }
  
    // // console.log('SessionId', sessionId);

    // const session = await req.modelFactory.userSession.fetchByExternalId(
    //   req.modelFactory,
    //   req.daoFactory,
    //   sessionId
    // );
    // if (!session) {
    //   // req.Logger.error('No valid session found for JWT', {
    //   //   sessionId: sessionId,
    //   // });
    //   next();
    //   return;
    // }
  
    // // if (session.sessionExpires < new Date()) {
    // //   // req.Logger.error('Session expired', {
    // //   //   sessionId: sessionId,
    // //   // });
    // //   next();
    // //   return;
    // // }
  
    // const user = await session.user;
    // if (!user) {
    //   // req.Logger.error('Unable to fetch client for session', {
    //   //   sessionId: sessionId,
    //   // });
    //   next();
    //   return;
    // }
  
    // // req.Logger.debug('Found client for session', {
    // //   sessionId: sessionId,
    // //   clientId: client.id,
    // // });
  
    // req.user = user;
    // // console.log('Authenticated: ', user.id);
    
    next();
  });

  app.engine('.hbs', engine({extname: '.hbs'}));
  app.set('view engine', '.hbs');
  app.set("views", "src/views");

  app.use(router);

  return app;
}