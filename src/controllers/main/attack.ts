import { Request, Response } from 'express';
import { Stats } from 'fs';
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
      attacker.offense == 0
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
      menu_category: 'battle',
      menu_link: 'attack',
      sidebarData: req.sidebarData,
      userDataFiltered: await req.user.formatUsersStats(req.user),
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
      attacker.offense == 0
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

    // TODO: this whole thing needs clean up.
    const stats: AttackLogStats[] = [
      {
        offensePoints: attacker.offense,
        defensePoints: defender.defense,
        pillagedGold: Math.floor(
          winner === attacker ? availablePillage : availablePillage * 0.3
        ),
        xpEarned: winner === attacker ? 10 : 0, //TODO: Create a formula for XP
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

    const earnedNewLevel =
      stats[0].xpEarned >= attacker.xpToNextLevel ? true : false;
    if (stats[0].xpEarned !== 0) attacker.addXP(stats[0].xpEarned);

    if (winner === attacker) {
      if (defender.gold != 0) {
        await attacker.addGold(availablePillage);
        await defender.subtractGold(availablePillage);
      }
    }
    await req.modelFactory.attackLog.createHistory(
      req.modelFactory,
      req.daoFactory,
      req.logger,
      attackLogData
    );

    res.render('page/main/attack/stat', {
      layout: 'main',
      pageTitle: 'Attack Results',
      menu_category: 'battle',
      menu_link: 'war_history',
      sidebarData: {
        gold: attacker.gold,
        citizens: attacker.citizens,
        level: attacker.level,
        experience: attacker.experience,
        xpToNextLevel: attacker.xpToNextLevel,
        attackTurns: attacker.attackTurns,
        nextTurnTimeStamp: attacker.getTimeToNextTurn(),
      },
      userDataFiltered: await req.user.formatUsersStats(req.user),
      winner: winner,
      attacker: {
        id: attacker.id,
        displayName: attacker.displayName,
        offense: attacker.offense,
        level: attacker.level,
      }, //TODO: the UserData isn't being passed, so this is a crude workaround for now
      defender: {
        id: defender.id,
        displayName: defender.displayName,
        defense: defender.defense,
        level: defender.level,
      }, //TODO: the UserData isn't being passed, so this is a crude workaround for now
      won: winner.id === attacker.id ? true : false,
      turns: parseInt(req.body?.turnsAmount),
      stats: stats[0],
      earnedNewLevel: earnedNewLevel,
      newLevel: attacker.level + 1,
    });
  },

  async renderAttackLogPage(req: Request, res: Response) {
    const battleID = req.params.id;
    const battleLog = await req.modelFactory.attackLog.fetchByID(
      req.modelFactory,
      req.daoFactory,
      req.logger,
      parseInt(battleID)
    );
    const attacker = await req.modelFactory.user.fetchById(
      req.modelFactory,
      req.daoFactory,
      req.logger,
      battleLog.attacker_id
    );
    const defender = await req.modelFactory.user.fetchById(
      req.modelFactory,
      req.daoFactory,
      req.logger,
      battleLog.defender_id
    );
    res.render('page/main/attack/stat', {
      layout: 'main',
      pageTitle: 'Attack Results',
      sidebarData: req.sidebarData,
      menu_category: 'battle',
      menu_link: 'war_history',
      winner: battleLog.winner,
      userDataFiltered: await req.user.formatUsersStats(req.user),
      attacker: {
        id: attacker.id,
        displayName: attacker.displayName,
        offense: attacker.offense,
        level: attacker.level,
      }, //TODO: the UserData isn't being passed, so this is a crude workaround for now
      defender: {
        id: defender.id,
        displayName: defender.displayName,
        defense: defender.defense,
        level: defender.level,
      }, //TODO: the UserData isn't being passed, so this is a crude workaround for now
      won: battleLog.winner === attacker.id ? true : false,
      turns: parseInt(req.body?.turnsAmount),
      stats: battleLog.stats,
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
      userDataFiltered: await req.user.formatUsersStats(req.user),
      menu_category: 'battle',
      menu_link: 'attack',

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
