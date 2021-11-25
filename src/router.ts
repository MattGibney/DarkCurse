import * as express from 'express';

import marketingHomeController from './controllers/marketing/home';
import marketingLoginController from './controllers/marketing/login';

import overviewController from './controllers/main/overview';
import attackController from './controllers/main/attack';

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
authedRouter.get('/attack', attackController.renderAttackList);
router.use(authedRouter);

export default router;
