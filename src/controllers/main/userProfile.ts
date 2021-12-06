import { Request, Response } from 'express';
import { Fortifications } from '../../constants';

export default {
  async renderUserProfile(req: Request, res: Response) {
    const userProfileId = Number(req.params.userId);
    
    const userProfile = await req.modelFactory.user.fetchById(
      req.modelFactory,
      req.daoFactory,
      req.logger,
      userProfileId
    );

    return res.render('page/main/userProfile', {
      layout: 'main',
      pageTitle: `Profile ${req.user.displayName}`,

      player: {
        gold: new Intl.NumberFormat('en-GB').format(req.user.gold),
        citizens: req.user.citizens,
        level: req.user.level,
        experience: new Intl.NumberFormat('en-GB').format(req.user.experience),
        xpToNextLevel: new Intl.NumberFormat('en-GB').format(req.user.xpToNextLevel),
        attackTurns: req.user.attackTurns,
      },

      userProfile: {
        displayName: userProfile.displayName,
        race: userProfile.race,
        class: userProfile.class,
        level: userProfile.level,
        overallRank: 0,
        population: userProfile.population,
        armySize: userProfile.armySize,
        fortification: Fortifications[userProfile.fortLevel].name,
        gold: new Intl.NumberFormat('en-GB').format(userProfile.gold),
        bio: 'THIS IS A BIO',
        // isOnline: false,
      }
    });
  }
}