import { Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';

export default {
  async renderLoginPage(req: Request, res: Response) {
    return res.render('page/marketing/login', {
      layout: 'marketing',
      pageTitle: 'Login',
    });
  },

  async loginAction(req: Request, res: Response) {
    const email = req.body?.email;
    const password = req.body?.password;

    if (!email || !password) {
      return res.render('page/marketing/login', {
        layout: 'marketing',
        pageTitle: 'Login',
        errorMessage: 'Email and password are mandatory',
      });
    }

    const user = await req.modelFactory.user.fetchByEmail(
      req.modelFactory,
      req.daoFactory,
      req.logger,
      email
    );

    if (!user) {
      return res.render('page/marketing/login', {
        layout: 'marketing',
        pageTitle: 'Login',
        errorMessage: 'Email or password not recognized',
      });
    }

    const isPasswordValid = await user.validatePassword(password);
    if (!isPasswordValid) {
      return res.render('page/marketing/login', {
        layout: 'marketing',
        pageTitle: 'Login',
        errorMessage: 'Email or password not recognised',
      });
    }

    const newSession = await req.modelFactory.userSession.createSession(
      req.modelFactory,
      req.daoFactory,
      req.logger,
      user.id
    );

    const newToken = jwt.sign(
      {
        id: newSession.externalId,
      },
      req.config.jwtSecret
    );

    res.cookie('DCT', newToken, {
      httpOnly: true,
      sameSite: 'strict',
      expires: new Date(Date.now() + req.config.jwtExpiry),
    });

    return res.redirect('/overview');
  },
};
