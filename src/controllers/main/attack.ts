import { Request, Response } from 'express';

export default {
  async renderAttackPage(req: Request, res: Response) {
    const attacker = await req.modelFactory.user.fetchById(
      req.modelFactory,
      req.daoFactory,
      req.logger,
      req.user.id
    );

    const defender = await req.modelFactory.user.fetchById(
      req.modelFactory,
      req.daoFactory,
      req.logger,
      parseInt(req.params.id)
    );

    if (
      defender.level >= attacker.level + 5 ||
      defender.level <= attacker.level - 5 ||
      defender.offense != 0
    ) {
      const err =
        defender.level <= attacker.level - 5
          ? 'TooLow'
          : defender.level >= attacker.level + 5
          ? 'TooHigh'
          : 'NoOffense';
      res.redirect(`/userprofile/${defender.id}?err=${err}`);
    }

    res.render('page/main/attack/turns', {
      layout: 'main',
      pageTitle: `Attack ${defender.id}`,
      sidebarData: req.sidebarData,
      turns: attacker.attackTurns,
    });
  },

  async renderAttackList(req: Request, res: Response) {
    const players = await req.modelFactory.user.fetchAll(
      req.modelFactory,
      req.daoFactory,
      req.logger
    );

    const user = await req.modelFactory.user.fetchById(
      req.modelFactory,
      req.daoFactory,
      req.logger,
      req.user.id
    );

    res.render('page/main/attack/list', {
      layout: 'main',
      pageTitle: 'Attack List',
      sidebarData: req.sidebarData,

      players: players.map((player) => ({
        id: player.id,
        rank: player.rank,
        displayName: player.displayName,
        gold: new Intl.NumberFormat('en-GB').format(player.gold),
        armySize: new Intl.NumberFormat('en-GB').format(player.armySize),
        level: player.level,
        race: player.race,
        is_player: player.id == user.id,
      })),
    });
  },
};
