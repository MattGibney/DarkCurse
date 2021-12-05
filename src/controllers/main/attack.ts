import { Request, Response } from 'express';

export default {
  async renderAttackList(req: Request, res: Response) {

    const players = await req.modelFactory.user.fetchAll(
      req.modelFactory,
      req.daoFactory,
      req.logger
    );

    res.render('page/main/attack/list', {
      layout: 'main',
      pageTitle: 'Attack List',

      gold: new Intl.NumberFormat('en-GB').format(req.user.gold),
      citizens: req.user.citizens,
      level: req.user.level,
      experience: new Intl.NumberFormat('en-GB').format(req.user.experience),
      xpToNextLevel: new Intl.NumberFormat('en-GB').format(req.user.xpToNextLevel),
      attackTurns: req.user.attackTurns,

      players: players.map(player => ({
        id: player.id,
        rank: '',
        displayName: player.displayName,
        gold: new Intl.NumberFormat('en-GB').format(player.gold),
        armySize: new Intl.NumberFormat('en-GB').format(player.armySize),
        level: player.level,
        race: player.race
      })),
    });
  }
}