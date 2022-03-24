import * as express from 'express';

import marketingHomeController from './controllers/marketing/home';
import marketingLoginController from './controllers/marketing/login';

import attackController from './controllers/main/attack';
import bankController from './controllers/main/bank';
import overviewController from './controllers/main/overview';
import trainingController from './controllers/main/training';
import userProfileController from './controllers/main/userProfile';

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

authedRouter.get('/attack', attackController.renderAttackList);
authedRouter.get('/bank/deposit', (req, res) =>
  bankController.bankPage(req, res)
);
authedRouter.post('/bank/deposit', (req, res) =>
  bankController.bankDepositGold(req, res, bankController.bankPage)
);
authedRouter.get('/bank/history', (req, res) =>
  bankController.historyPage(req, res)
);
authedRouter.get('/overview', overviewController.overviewPage);
authedRouter.get('/training', trainingController.trainingPage);
authedRouter.post('/training', trainingController.trainUnitsAction);
authedRouter.get(
  '/userprofile/:userId',
  userProfileController.renderUserProfile
);
router.use(authedRouter);

export default router;
