import { Request, Response } from 'express';

export default {
  async settingsPage(req: Request, res: Response) {
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

    res.render('page/main/settings', {
      layout: 'main',
      pageTitle: 'Settings',
      menu_category: 'home',
      menu_link: 'settings',
      userDataFiltered: await user.formatUsersStats(req.user),
      email: user.email, //we're not putting this into the FormatUserStats, it's only used 1 time and not needed anywhere else.
      sidebarData: req.sidebarData,
    });
    return;
  },
};
