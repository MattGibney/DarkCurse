import * as express from 'express';

import marketingHomeController from './controllers/marketing/home';
import marketingLoginController from './controllers/marketing/login';

import overviewController from './controllers/overview';

const router = express.Router();

// Home
router.get('/', marketingHomeController.renderHomePage);

// Login
router.get('/login', marketingLoginController.renderLoginPage);
router.post('/login', marketingLoginController.loginAction);


const authedRouter = express.Router();

authedRouter.use((req, res, next) => {
  if (!req.user) {
    return res.sendStatus(401);
  }
  next();
});

authedRouter.get('/overview', overviewController.overviewPage);
router.use(authedRouter);

export default router;
