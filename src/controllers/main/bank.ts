import { Request, Response } from 'express';
export default {
  bankPage(req: Request, res: Response) {
    return res.render('page/main/bank', {
      layout: 'main',
      pageTitle: 'Bank',
    });
  }
}