import { Request, Response } from 'express';

export default {
  async renderHomePage(req: Request, res: Response) {
    return res.render('page/marketing/home', {
      layout: 'marketing',
      pageTitle: 'Home',
    });
  },
}
