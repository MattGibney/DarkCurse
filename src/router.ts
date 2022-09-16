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
router.get('/', middleware.authenticate, (req, res, next) => {
  console.log(req.user);
  if (req.user){
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

router.get(
  '/attack',
  middleware.authenticate,
  attackController.renderAttackList
);
router.post(
  '/attack/:id/status',
  middleware.authenticate,
  attackController.handleAttack
);
router.get('/attack/status/:id', middleware.authenticate, attackController.renderAttackLogPage);
router.get('/bank/deposit', middleware.authenticate, (req, res) =>
  bankController.bankPage(req, res)
);
router.post('/bank/deposit', middleware.authenticate, (req, res) =>
  bankController.bankDepositGold(req, res, bankController.bankPage)
);
router.get('/bank/history', middleware.authenticate, (req, res) =>
  bankController.historyPage(req, res)
);
router.get('/repair', middleware.authenticate, (req, res) =>
  repairController.renderRepairPage(req, res)
);
router.get(
  '/overview',
  middleware.authenticate,
  overviewController.overviewPage
);
router.get(
  '/training',
  middleware.authenticate,
  trainingController.trainingPage
);
router.get(
  '/armory',
  middleware.authenticate,
  armoryController.armoryPage
)

router.get(
  '/attack/:id',
  middleware.authenticate,
  attackController.renderAttackPage
)

router.post(
  '/training/train',
  middleware.authenticate,
  trainingController.trainUnitsAction
);
router.post(
  '/training/untrain',
  middleware.authenticate,
  trainingController.untrainUnitsAction,
);
router.post(
  '/armory/equip',
  middleware.authenticate,
  armoryController.equipItemAction
);
router.post(
  '/armory/unequip',
  middleware.authenticate,
  armoryController.unequipItemsAction,
);
router.get('/userprofile/:userId', userProfileController.renderUserProfile);

export default router;
