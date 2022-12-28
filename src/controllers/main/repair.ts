import { Request, Response } from 'express';
import { PageAlert } from '../../../types/typings';
import { Fortifications } from '../../constants';

export default {
  async renderRepairPage(req: Request, res: Response, alert?: PageAlert) {
    const user = await req.modelFactory.user.fetchById(
      req.modelFactory,
      req.daoFactory,
      req.logger,
      req.user.id
    );
    const userFort = () => {
      const fort = Fortifications[user.fortLevel];
      fort['health'] = user.fortHealth;
      fort['maxRepairPoints'] = user.fortHealth.max - user.fortHealth.current;
      return fort;
    };

    res.render('page/main/repair', {
      layout: 'main',
      pageTitle: 'Repair',
      menu_category: 'structures',
      menu_link: 'repair',
      fort: userFort(),
      gold: user.gold,
      goldInBank: user.goldInBank,
      sidebarData: req.sidebarData,
      userDataFiltered: await req.user.formatUsersStats(req.user),
    });
    return;
  },

  async handleRepair(
    req: Request,
    res: Response,
    repairPageController: (
      req: Request,
      res: Response,
      alert?: PageAlert
    ) => Promise<void>
  ) {
    let repairAmount = parseInt(req.body.repairAmount);

    if (!repairAmount) {
      return repairPageController(req, res, {
        type: 'DANGER',
        message: 'You must specify an amount to repair',
      });
    }

    if (repairAmount < 0) {
      return repairPageController(req, res, {
        type: 'DANGER',
        message: 'You cannot repair with a negative amount',
      });
    }

    const user = await req.modelFactory.user.fetchById(
      req.modelFactory,
      req.daoFactory,
      req.logger,
      req.user.id
    );

    const userFort = () => {
      const fort = Fortifications[user.fortLevel];
      fort['health'] = user.fortHealth;
      fort['maxRepairPoints'] = user.fortHealth.max - user.fortHealth.current;
      return fort;
    };

    const fort = userFort();
    if (repairAmount > fort['maxRepairPoints']) {
      repairAmount = fort['maxRepairPoints'];
    }

    const costToRepair = fort.costPerRepairPoint * repairAmount;

    if (user.gold < costToRepair) {
      return repairPageController(req, res, {
        type: 'DANGER',
        message: 'You cannot afford to repair this amount',
      });
    }

    //await user.subtractGold(costToRepair);
    await user.addFortHP(repairAmount);
    return repairPageController(req, res, {
      type: 'SUCCESS',
      message: 'You`ve increased your Fort HP by ' + repairAmount,
    });
  },
};
