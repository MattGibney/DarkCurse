/* eslint-disable prettier/prettier */
import * as express from 'express';

import marketingHomeController from './controllers/marketing/home';
import marketingLoginController from './controllers/marketing/login';
import marketingSignupController from './controllers/marketing/signup';
import marketingSignoutController from './controllers/marketing/signout';

import attackController from './controllers/main/attack';
import bankController from './controllers/main/bank';
import overviewController from './controllers/main/overview';
import trainingController from './controllers/main/training';
import userProfileController from './controllers/main/userProfile';
import armoryController from './controllers/main/armory';
import repairController from './controllers/main/repair';
import middleware from './middleware';
import attack from './controllers/main/attack';

const router = express.Router();

// Home
router.get('/', (req, res, next) => {
  if (req.user != undefined){
    res.redirect('/overview');
  }
  next();
}, marketingHomeController.renderHomePage);

// Login
router.get('/login', marketingLoginController.renderLoginPage);
router.post('/login', marketingLoginController.loginAction);

// Signup
router.get('/signup', marketingSignupController.renderSignupPage);
router.post('/signup', marketingSignupController.signupAction);

// Signout
router.get('/signout', marketingSignoutController.signoutAction);

// View User Profile
router.get('/userprofile/:userId', userProfileController.renderUserProfile);

const authedRouter = express.Router();

authedRouter.use((req, res, next) => {
  if (!req.user) {

    return res.redirect('/login?err=auth');
    //return res.sendStatus(401);
  }
  next();
});

authedRouter.get(
  '/attack',
  attackController.renderAttackList
);
authedRouter.post(
  '/attack/:id/status',
  attackController.handleAttack
);
authedRouter.get('/attack/status/:id',  attackController.renderAttackLogPage);
authedRouter.get('/bank/deposit',  (req, res) =>
  bankController.bankPage(req, res)
);
authedRouter.post('/bank/deposit',  (req, res) =>
  bankController.bankDepositGold(req, res, bankController.bankPage)
);
authedRouter.get('/bank/history',  (req, res) =>
  bankController.historyPage(req, res)
);
authedRouter.get('/repair',  (req, res) =>
  repairController.renderRepairPage(req, res)
);
authedRouter.get(
  '/overview',
  
  overviewController.overviewPage
);
authedRouter.get(
  '/training',
  
  trainingController.trainingPage
);
authedRouter.get(
  '/armory',
  
  armoryController.armoryPage
)

authedRouter.get(
  '/attack/:id',
  
  attackController.renderAttackPage
)

authedRouter.post(
  '/training/train',
  
  trainingController.trainUnitsAction
);
authedRouter.post(
  '/training/untrain',
  
  trainingController.untrainUnitsAction,
);
authedRouter.post(
  '/armory/equip',
  
  armoryController.equipItemAction
);
authedRouter.post(
  '/armory/unequip',
  
  armoryController.unequipItemsAction,
);


router.use(authedRouter);

export default router;
