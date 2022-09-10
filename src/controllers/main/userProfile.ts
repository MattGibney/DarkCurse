import { Request, Response } from 'express';
import { Fortifications } from '../../constants';

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
    return res.render('page/main/userProfile', {
      layout: 'main',
      pageTitle: `Profile ${req.user.displayName}`,
      sidebarData: req.sidebarData,

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
      isOnline:
        userProfile.last_active < new Date(new Date().getTime() - 300000)
          ? false
          : true,
      isPlayer: userProfileId == req.user.id ? true : false,
    });
  },
};
