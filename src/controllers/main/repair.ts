import { Request, Response } from 'express';
import { Fortifications } from '../../constants';

export default {
  async renderRepairPage(req: Request, res: Response) {
    const user = await req.modelFactory.user.fetchById(
      req.modelFactory,
      req.daoFactory,
      req.logger,
      req.user.id
    );
    if (req.body?.repair) {
    } else {
    }
    const userFort = () => {
      const fort = Fortifications[user.fortLevel];
      fort['health'] = user.fortHealth;
      fort['maxRepairPoints'] = user.fortHealth.max - user.fortHealth.current;
      return fort;
    };

    res.render('page/main/repair', {
      fort: userFort(),
      gold: user.gold,
      goldInBank: user.goldInBank,
    });
    return;
  },
};
