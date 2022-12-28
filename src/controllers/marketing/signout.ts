import { Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';

export default {
  async signoutAction(req: Request, res: Response) {
    res.cookie('DCT', '', {
      httpOnly: true,
      sameSite: 'strict',
      maxAge: 1,
    });
    return res.redirect('/');
  },
};
