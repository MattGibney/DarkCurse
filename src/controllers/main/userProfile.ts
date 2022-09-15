import { Request, Response } from 'express';
import { Fortifications } from '../../constants';

interface PageAlert {
  type: 'success' | 'danger';
  message: string;
}

export default {
  async renderUserProfile(req: Request, res: Response) {
    const userProfileId = Number(req.params.userId);
    if (userProfileId == req.user.id) return res.redirect('/overview');

    const userProfile = await req.modelFactory.user.fetchById(
      req.modelFactory,
      req.daoFactory,
      req.logger,
      userProfileId
    );

    const userProfileRank = await userProfile.fetchRank(userProfile.id);
    let cantAttack = true;

    if (
      userProfile.level >= req.user.level - 5 &&
      userProfile.level <= req.user.level + 5 &&
      req.user.offense != 0
    ) {
      cantAttack = false;
    }


    let messages: PageAlert;
    if (req.query.err) {
      const err = req.query.err;
      console.log(err);
      if (err == 'TooHigh')
        messages = {
          type: 'danger',
          message: 'That player is too high for you to attack!',
        };
      else if (err == 'TooLow')
        messages = {
          type: 'danger',
          message: 'That player is too low for you to attack!',
        };
      else
        messages = {
          type: 'danger',
          message: 'You need to train soldiers to be able to attack!!',
        };
    }

    return res.render('page/main/userProfile', {
      layout: 'main',
      pageTitle: `Profile ${req.user.displayName}`,
      sidebarData: req.sidebarData,
      id: userProfile.id,
      displayName: userProfile.displayName,
      race: userProfile.race,
      class: userProfile.class,
      level: userProfile.level,
      overallRank: userProfileRank,
      population: userProfile.population,
      armySize: userProfile.armySize,
      fortification: Fortifications[userProfile.fortLevel].name,
      gold: new Intl.NumberFormat('en-GB').format(userProfile.gold),
      bio: 'THIS IS A BIO',
      cantAttack: cantAttack,
      messages: messages,
      isOnline:
        userProfile.last_active < new Date(new Date().getTime() - 300000)
          ? false
          : true,
      isPlayer: userProfileId == req.user.id ? true : false,
    });
  },
};
