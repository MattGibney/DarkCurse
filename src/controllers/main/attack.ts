import { Request, Response } from 'express';
import { AttackLogStats, AttackLogData } from '../../daos/attackLog';
import UserModel from '../../models/user';

function canAttack(AttackLevel: number, DefenseLevel: number) {
  if (DefenseLevel > AttackLevel + 5) return false;
  else if (DefenseLevel < AttackLevel - 5) return false;
  else return true;
}

export default {
  // Render Form for entering Turns
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

    if (!canAttack(attacker.level, defender.level) || attacker.offense == 0) {
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

    if (!canAttack(attacker.level, defender.level) || attacker.offense == 0) {
      const err =
        defender.level <= attacker.level - 5
          ? 'TooLow'
          : defender.level >= attacker.level + 5
          ? 'TooHigh'
          : 'NoOffense';
      return res.redirect(`/userprofile/${defender.id}?err=${err}`);
    }

    const attackQuota = await req.modelFactory.attackLog.canAttackUser(
      req.modelFactory,
      req.daoFactory,
      req.logger,
      defender,
      attacker
    );
    if (attackQuota === false) {
      const err = 'TooMany';
      return res.redirect(`/userprofile/${defender.id}?err=${err}`);
    }

    await attacker.subtractTurns(parseInt(req.body?.turnsAmount));
    const winner = attacker.offense > defender.defense ? attacker : defender;
    const availablePillage =
      Math.floor(Math.random() * (defender.gold * 0.8 + 1)) *
      (parseInt(req.body.turnsAmount) / 100);

    // Ported from old ezRPG 1.2.x Attack module
    // Clone of the PHP Rand function
    const rand = (min?: number, max?: number) => {
      const minn = min || 0;
      const maxx = max || Number.MAX_SAFE_INTEGER;
      return Math.floor(Math.random() * (maxx - minn + 1)) + minn;
    };

    // Level Mitigation - Courtesy of LuK
    // Check the level difference for mitigation
    let levelMitigation = 0;
    if (attacker.level > defender.level + 5) {
      levelMitigation = Math.pow(0.96, attacker.level - defender.level - 5);
    } else {
      levelMitigation = 1.0;
    }

    const getHPResults = (
      user: UserModel,
      victor: boolean,
      victim: UserModel
    ) => {
      if (victor === true) {
        return {
          defender:
            rand(
              victim.fortHealth.current /
                (victim.level < user.level
                  ? rand(user.level - victim.level + 1, 5)
                  : rand(victim.level - user.level + 1, 8)),
              victim.fortHealth.current
            ) *
            (parseInt(req.body.turnsAmount) / 10),
          attacker:
            rand(
              user.fortHealth.current /
                (user.level < victim.level
                  ? rand(victim.level - user.level + 1, 5)
                  : rand(user.level - victim.level + 1, 8)),
              victim.fortHealth.current
            ) *
            (parseInt(req.body.turnsAmount) / 10),
        };
      } else {
        return {
          defender:
            rand(
              user.fortHealth.current /
                (user.level < victim.level
                  ? rand(victim.level - user.level + 1, 5)
                  : rand(user.level - victim.level + 1, 8)),
              victim.fortHealth.current
            ) *
            (parseInt(req.body.turnsAmount) / 10),
          attacker:
            rand(
              Math.round(user.fortHealth.current / 2),
              Math.round(user.fortHealth.current + 10)
            ) *
            (parseInt(req.body.turnsAmount) / 10),
        };
      }
    };

    const damage = (user: UserModel, victor: boolean, victim: UserModel) => {
      return {
        defender: {
          hp: Math.round(
            (victor
              ? rand(
                  victim.fortHealth.current /
                    (victim.level < user.level
                      ? rand(user.level - victim.level + 1, 5)
                      : rand(victim.level - user.level + 1, 8)),
                  victim.fortHealth.current
                )
              : rand(
                  user.fortHealth.current /
                    (user.level < victim.level
                      ? rand(victim.level - user.level + 1, 5)
                      : rand(user.level - victim.level + 1, 8)),
                  victim.fortHealth.current
                )) *
              (parseInt(req.body.turnsAmount) / 10)
          ),
          xp:
            (victor
              ? 0
              : user.level > defender.level
              ? rand(victim.experience, user.experience - victim.experience + 1)
              : user.experience > victim.experience
              ? rand(
                  user.experience - victim.experience + 1,
                  user.experience + 1
                )
              : rand(
                  victim.experience - user.experience + 1,
                  victim.experience + 1
                )) *
            (parseInt(req.body.turnsAmount) / 10),
        },
        attacker: {
          xp: victor
            ? Math.round(
                user.level > defender.level
                  ? rand(
                      victim.experience,
                      user.experience - victim.experience + 1
                    )
                  : user.experience > victim.experience
                  ? rand(
                      user.experience - victim.experience + 1,
                      user.experience + 1
                    )
                  : rand(
                      victim.experience - user.experience + 1,
                      victim.experience + 1
                    )
              ) *
              (parseInt(req.body.turnsAmount) / 10)
            : 0,
          hp:
            (victor
              ? Math.round(
                  rand(
                    user.fortHealth.current /
                      (user.level < victim.level
                        ? rand(victim.level - user.level + 1, 5)
                        : rand(user.level - victim.level + 1, 8)),
                    victim.fortHealth.current
                  )
                )
              : rand(
                  Math.round(user.fortHealth.current / 2),
                  Math.round(user.fortHealth.current + 10)
                )) *
            (parseInt(req.body.turnsAmount) / 10),
        },
      };
    };

    const attackerDamage = damage(attacker, attacker === winner, defender);

    // TODO: this whole thing needs clean up.
    const stats: AttackLogStats[] = [
      {
        offensePoints: attacker.offense,
        defensePoints: defender.defense,
        pillagedGold: Math.floor(winner === attacker ? availablePillage : 0),
        xpEarned: Math.round(attackerDamage.attacker.xp),
        offenseXPStart: attacker.experience,
        hpDamage: attackerDamage.defender.hp,
        offenseUnitsCount: 0,
        offenseUnitsLost: [],
        defenseUnitsCount: 0,
        defenseUnitsLost: [],
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
      sidebarData: req.sidebarData,
      userDataFiltered: await req.user.formatUsersStats(req.user),
      winner: winner,
      attacker: {
        id: attacker.id,
        displayName: attacker.displayName,
        offense: Math.floor(attacker.offense),
        level: attacker.level,
      }, //TODO: the UserData isn't being passed, so this is a crude workaround for now
      defender: {
        id: defender.id,
        displayName: defender.displayName,
        defense: Math.floor(defender.defense),
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

  async testAttack(req: Request, res: Response) {
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

    if (!canAttack(attacker.level, defender.level) || attacker.offense == 0) {
      const err =
        defender.level <= attacker.level - 5
          ? 'TooLow'
          : defender.level >= attacker.level + 5
          ? 'TooHigh'
          : 'NoOffense';
      return res.json({ err: err });
    }

    const attackQuota = await req.modelFactory.attackLog.canAttackUser(
      req.modelFactory,
      req.daoFactory,
      req.logger,
      defender,
      attacker
    );
    if (attackQuota === false) {
      const err = 'TooMany';
      return res.json({ err: err });
    }
    const winner = attacker.offense > defender.defense ? attacker : defender;
    const availablePillage =
      Math.floor(Math.random() * (defender.gold * 0.8 + 1)) *
      (parseInt(req.body.turnsAmount) / 10);

    // Ported from old ezRPG 1.2.x Attack module
    // Clone of the PHP Rand function
    const rand = (min?: number, max?: number) => {
      const minn = min || 0;
      const maxx = max || Number.MAX_SAFE_INTEGER;
      return Math.floor(Math.random() * (maxx - minn + 1)) + minn;
    };

    // Level Mitigation - Courtesy of LuK
    // Check the level difference for mitigation
    let levelMitigation = 0;
    if (attacker.level > defender.level + 5) {
      levelMitigation = Math.pow(0.96, attacker.level - defender.level - 5);
    } else {
      levelMitigation = 1.0;
    }

    return res.json({
      msg: 'hi ' + req.user.displayName,
      winner: winner.displayName,
      attacker: attacker.displayName,
      defender: defender.displayName,
      defenderUnitDefense: defender.unitTotals[0].defense,
      attackerUnitOffense: attacker.unitTotals[0].offense,
      AttackerOffense: attacker.offense,
      DefenderDefense: defender.defense,
      levelMitigation: levelMitigation,
      defenderFortHealth: defender.fortHealth.percentage,
      defenderFortLevel: defender.fortLevel,
      defenderGold: defender.gold,
      availablePillage: availablePillage,
    });
  },
};
