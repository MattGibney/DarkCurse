import { Request, Response } from 'express';
import * as bcrypt from 'bcrypt';
import { PlayerRace, PageAlert } from '../../../types/typings';

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

  async handleSave(req: Request, res: Response) {
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
    let errors = [] as PageAlert[];
    //console.log(req);
    if (req.body?.submitColourScheme !== undefined) {
      if (req.body?.colourScheme) {
        console.log('in here');
        try {
          const colourScheme = req.body.colourScheme as PlayerRace;
          await user.setColourScheme(colourScheme);
        } catch (e) {
          errors.push({ type: 'DANGER', message: 'e.message' });
          throw e.message;
        }
      }
    }
    if (req.body?.submitPassword !== undefined) {
      if (
        req.body?.currentPassword &&
        req.body?.newPassword &&
        req.body?.confirmPassword &&
        req.body?.newPassword === req.body?.confirmPassword
      ) {
        const isValidPassword = req.user.validatePassword(
          req.body.currentPassword
        );
        if (isValidPassword) {
          const hash = await bcrypt.hash(
            req.body.newPassword,
            req.user.getSalt
          );
          await req.user.updatePassword(hash);
        } else {
          errors.push({ type: 'DANGER', message: 'Invalid Current Password' });
        }
      }
    }
    //return res.json(req.body);
    res.redirect(
      '/settings' + (errors.length ? `?err=${errors[0].message}` : '')
    );
  },
};
