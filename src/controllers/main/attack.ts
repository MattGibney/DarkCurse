import { Request, Response } from 'express';
import { AttackLogStats, AttackLogData } from '../../daos/attackLog';

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
      defender: defender,
    });
  },

  async handleAttack(req: Request, res: Response) {
    const defender = await req.modelFactory.user.fetchById(
      req.modelFactory,
      req.daoFactory,
      req.logger,
      parseInt(req.params.id)
    );
    const attacker = await req.modelFactory.user.fetchById(
      req.modelFactory,
      req.daoFactory,
      req.logger,
      req.user.id
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

    if (attacker.attackTurns < 1 || attacker.offense == 0) {
      const err =
        attacker.attackTurns < 1
          ? 'NoTurns'
          : attacker.offense == 0
          ? 'NoOff'
          : '';
      res.redirect(`/userprofile/${defender.id}?err=${err}`);
    }

    const winner = attacker.offense > defender.defense ? attacker : defender;
    const availablePillage =
      Math.floor(Math.random() * (defender.gold * 0.8 + 1)) +
      0 * (parseInt(req.body.turnsAmount) / 100);

    await attacker.subtractTurns(parseInt(req.body?.turnsAmount));
    if (winner === attacker) {
      if (defender.gold != 0) {
        await attacker.addGold(availablePillage);
        await defender.subtractGold(availablePillage);
      }
      const stats: AttackLogStats[] = [
        {
          offensePoints: attacker.offense,
          defensePoints: defender.defense,
          pillagedGold: availablePillage,
          xpEarned: 10,
          offenseXPStart: attacker.experience,
        },
      ];
      const attackLogData: AttackLogData = {
        attacker_id: attacker.id,
        defender_id: defender.id,
        winner: winner.id,
        stats: stats,
        timestamp: new Date(),
      };
      await req.modelFactory.attackLog.createHistory(
        req.modelFactory,
        req.daoFactory,
        req.logger,
        attackLogData
      );
    }
    console.log(
      'Attacker: %s, Defender: %s',
      attacker.offense,
      defender.defense
    );
    console.log(
      'Attacker: %s, Defender: %s, Winner: %s',
      attacker.id,
      defender.id,
      winner.id
    );
    res.render('page/main/attack/stat', {
      layout: 'main',
      pageTitle: 'Attack Results',
      sidebarData: req.sidebarData,
      winner: winner,
      attacker: {
        id: attacker.id,
        displayName: attacker.displayName,
        offense: attacker.offense,
      }, //TODO: the UserData isn't being passed, so this is a crude workaround for now
      defender: {
        id: defender.id,
        displayName: defender.displayName,
        defense: defender.defense,
      }, //TODO: the UserData isn't being passed, so this is a crude workaround for now
      won: winner.id === attacker.id ? true : false,
      turns: parseInt(req.body?.turnsAmount),
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
