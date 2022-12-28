import { Request, Response } from 'express';

export default {
  async overviewPage(req: Request, res: Response) {
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

    const link = await user.userRecruitingLink();

    res.render('page/main/overview', {
      layout: 'main',
      pageTitle: 'Overview',
      menu_category: 'home',
      menu_link: 'overview',

      sidebarData: req.sidebarData,

      userDataFiltered: await user.formatUsersStats(req.user),
      attacks: {
        won: 0,
        total: 0,
        percentage: 0,
      },
      defends: {
        won: 0,
        total: 0,
        percentage: 0,
      },
      spyVictories: 0,
      sentryVictories: 0,
      recruitmentLink: link,
    });
    return;
  },
};
