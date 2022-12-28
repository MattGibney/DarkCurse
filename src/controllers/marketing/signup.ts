import { Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import { PlayerClass, PlayerRace, PlayerUnit } from '../../../types/typings';

export default {
  async renderSignupPage(req: Request, res: Response) {
    return res.render('page/marketing/signup', {
      layout: 'marketing',
      pageTitle: 'Signup',
    });
  },

  async signupAction(req: Request, res: Response) {
    const email = req.body?.email;
    const password = req.body?.password;
    const race = req.body?.race;
    const class_name = req.body?.class;
    const display_name = req.body?.display_name;

    if (!email || !password || !race || !class_name || !display_name) {
      return res.render('page/marketing/signup', {
        layout: 'marketing',
        pageTitle: 'Signup',
        errorMessage: 'Email and Password are mandatory',
      });
    }

    let user = await req.modelFactory.user.fetchByEmail(
      req.modelFactory,
      req.daoFactory,
      req.logger,
      email
    );

    if (user) {
      return res.render('page/marketing/login', {
        layout: 'marketing',
        pageTitle: 'Login',
        errorMessage: 'There is already a user with this account',
      });
    }

    user = await req.modelFactory.user.fetchByDisplayName(
      req.modelFactory,
      req.daoFactory,
      req.logger,
      display_name
    );

    if (user) {
      return res.render('page/marketing/signup', {
        layout: 'marketing',
        pageTitle: 'Signup',
        errorMessage: 'There is already a user with this display_name',
      });
    }

    if (!isOfTypePlayerClass(class_name) || !isOfTypePlayerRace(race)) {
      return res.render('page/marketing/signup', {
        layout: 'marketing',
        pageTitle: 'Signup',
        errorMessage: 'There is an issue with the Race or Class you submitted',
      });
    }

    const myUser = await req.modelFactory.user.createUser(
      email,
      password,
      race,
      class_name,
      display_name,
      req.daoFactory
    );

    console.log(myUser);

    const newSession = await req.modelFactory.userSession.createSession(
      req.modelFactory,
      req.daoFactory,
      req.logger,
      myUser.id
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
function isOfTypePlayerRace(raceInput: string): raceInput is PlayerRace {
  return ['UNDEAD', 'HUMAN', 'GOBLIN', 'ELF'].includes(raceInput);
}

function isOfTypePlayerClass(classInput: string): classInput is PlayerClass {
  return ['FIGHTER', 'CLERIC', 'ASSASSIN', 'THIEF'].includes(classInput);
}
