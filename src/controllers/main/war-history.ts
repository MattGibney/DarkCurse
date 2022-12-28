import { Request, Response } from 'express';

export default {
  async warhistoryPage(req: Request, res: Response) {
    const offenseLog = await req.modelFactory.attackLog.fetchUserOffenseHistory(
      req.modelFactory,
      req.daoFactory,
      req.logger,
      req.user
    );

    const defenseLog = await req.modelFactory.attackLog.fetchUserDefenseHistory(
      req.modelFactory,
      req.daoFactory,
      req.logger,
      req.user
    );

    const user = await req.modelFactory.user.fetchById(
      req.modelFactory,
      req.daoFactory,
      req.logger,
      req.user.id
    );

    if (!user) {
      res.sendStatus(404);
      return;
    }

    res.render('page/main/war-history', {
      layout: 'main',
      pageTitle: 'War History',
      menu_category: 'battle',
      menu_link: 'war-history',
      userDataFiltered: await req.user.formatUsersStats(req.user),
      attackLogs: await Promise.all(
        offenseLog.map(async (log) => ({
          outcome: log.winner == req.user.id ? 'Won' : 'Lost',
          user: await (
            await req.modelFactory.user.fetchById(
              req.modelFactory,
              req.daoFactory,
              req.logger,
              log.defender_id
            )
          ).displayName,
          goldPillaged: log.stats[0],
          casualties: 'N/A',
          timestamp: new Date(log.timestamp.toLocaleString()),
        }))
      ),
      defenseLogs: await Promise.all(
        defenseLog.map(async (log) => ({
          outcome: log.winner == req.user.id ? 'Won' : 'Lost',
          user: await (
            await req.modelFactory.user.fetchById(
              req.modelFactory,
              req.daoFactory,
              req.logger,
              log.attacker_id
            )
          ).displayName,
          goldPillaged: log.stats,
          casualties: 'N/A',
          timestamp: new Date(log.timestamp),
        }))
      ),
      sidebarData: req.sidebarData,
    });
    return;
  },
};
