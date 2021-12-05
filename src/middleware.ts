import { Request, Response } from 'express';
import * as jsonwebtoken from 'jsonwebtoken';

export default {
  async authenticate(req: Request, res: Response, next) {
    const JWTCookie = req.cookies['DCT'];
    if (!JWTCookie) {
      req.logger.debug('Request does not contain a JWT');
      return next();
    }

    try {
      const decodedToken = jsonwebtoken.verify(JWTCookie, req.config.jwtSecret);
      const sessionId = decodedToken.valueOf()['id'];

      req.logger.debug(`Request contains a valid JWT with sessionId: ${sessionId}`);

      const session = await req.modelFactory.userSession.fetchByExternalId(
        req.modelFactory,
        req.daoFactory,
        req.logger,
        sessionId
      );

      if (!session) {
        req.logger.debug('No valid session found for JWT', {
          sessionId: sessionId,
        });
        return next();
      }

      const user = await session.user;
      if (!user) {
        req.logger.error('Unable to fetch client for session', {
          sessionId: sessionId,
        });
        return next();
      }

      req.logger.debug('Found client for session', {
        sessionId: sessionId,
        userId: user.id,
      });

      req.user = user;

      return next();
    } catch (error) {
      req.logger.error('Request JWT invalid', { error: error.message });
      res.clearCookie('DCT');
      return next();
    }
  }
}
