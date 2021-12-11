import { Request, Response } from 'express';
export default {
  bankPage(req: Request, res: Response) {
    return res.render('page/main/bank', {
      layout: 'main',
      pageTitle: 'Bank',
      sidebarData: req.sidebarData,

      gold: new Intl.NumberFormat('en-GB').format(req.user.gold),
      goldInBank: new Intl.NumberFormat('en-GB').format(req.user.goldInBank),

      deposits: {
        remaining: 1,
        max: 2,
        isMax: false,
      },
    });
  },
};
