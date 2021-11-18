import * as express from 'express';

export default {
  async overviewPage(req: express.Request, res: express.Response) {

    const user = await req.modelFactory.user.fetchById(
      req.modelFactory,
      req.daoFactory,
      1
    );

    if (!user) {
      res.sendStatus(404);
      return;
    }

    res.render('overview', {
      layout: 'main',

      displayName: user.displayName,
      race: user.race,
      class: user.class,

      population: new Intl.NumberFormat('en-GB').format(user.population),
      armySize: new Intl.NumberFormat('en-GB').format(user.armySize),
      level: new Intl.NumberFormat('en-GB').format(user.level),
      xpToNextLevel: new Intl.NumberFormat('en-GB').format(user.xpToNextLevel),
      fortHealth: {
        current: new Intl.NumberFormat('en-GB').format(user.fortHealth.current),
        max: new Intl.NumberFormat('en-GB').format(user.fortHealth.max),
        percentage: user.fortHealth.percentage
      },
      gold: new Intl.NumberFormat('en-GB').format(user.gold),
      goldPerTurn: new Intl.NumberFormat('en-GB').format(user.goldPerTurn),
      goldInBank: new Intl.NumberFormat('en-GB').format(user.goldInBank),
    });
    return;
  }
}
