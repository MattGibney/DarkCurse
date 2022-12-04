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
import structureUpgradeController from './controllers/main/structure-upgrades';
import warhistoryController from './controllers/main/war-history'; 
import settingsController from './controllers/main/settings';
import messagingController from './controllers/main/messaging';

const router = express.Router();

// Home
router.get(
  '/',
  (req, res, next) => {
    if (req.user != undefined) {
      res.redirect('/overview');
    }
    next();
  },
  marketingHomeController.renderHomePage
);

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

router.get('/recruit/:id', userProfileController.renderRecruitPage);
router.post('/recruit/:id', userProfileController.handleRecruitment);

const authedRouter = express.Router();

authedRouter.use((req, res, next) => {
  if (!req.user) {
    return res.redirect('/login?err=auth');
    //return res.sendStatus(401);
  }
  next();
});

authedRouter.get('/attack', attackController.renderAttackList);
authedRouter.post('/attack/:id/status', (req, res) => {
  if (
    req.body?.turnsAmount > req.user?.attackTurns ||
    req.body?.turnsAmount > 10 ||
    req.body?.turnsAmount <= 0
  ) {
    const err =
      req.body?.turnsAmount > req.user?.attackTurns
        ? 'TooManyTurns'
        : req.body?.turnsAmount > 10
        ? 'OverTen'
        : '0';
    return res.redirect(`/userprofile/${req.params.id}?err=${err}`);
  }
  if (req.user?.attackTurns < 1 || req.user?.offense == 0) {
    const err =
      req.user?.attackTurns < 1
        ? 'NoTurns'
        : req.user?.offense == 0
        ? 'NoOff'
        : '';
    return res.redirect(`/userprofile/${req.params.id}?err=${err}`);
  }
  attackController.handleAttack(req, res);
});
authedRouter.post('/attack/:id/test', (req, res) => {
  attackController.testAttack(req, res);
})
authedRouter.get('/attack/status/:id', attackController.renderAttackLogPage);
authedRouter.get('/bank/deposit', (req, res) =>
  bankController.bankPage(req, res)
);
authedRouter.post('/bank/deposit', (req, res) =>
  bankController.bankDepositGold(req, res, bankController.bankPage)
);
authedRouter.get('/bank/history', (req, res) =>
  bankController.historyPage(req, res)
);
authedRouter.get('/repair', (req, res) =>
  repairController.renderRepairPage(req, res)
);
authedRouter.get('/overview', overviewController.overviewPage);
authedRouter.get('/training', trainingController.trainingPage);
authedRouter.get('/armory', armoryController.armoryPage);

authedRouter.get('/attack/:id', attackController.renderAttackPage);
authedRouter.get('/war-history', (req, res) => warhistoryController.warhistoryPage(req, res));
authedRouter.get('/my-profile', (req, res) => userProfileController.renderMyProfile(req,res));
authedRouter.get('/settings', (req, res) => settingsController.settingsPage(req, res));
authedRouter.get('/levels', (req, res) => res.send('Not Implemented Yet'));
authedRouter.get('/battle-upgrades', (req, res) => res.send('Not Implemented Yet'));
authedRouter.get('/structure-upgrades', (req, res) => structureUpgradeController.strcutureUpgradesPage(req, res));
authedRouter.get('/housing', (req, res) => res.send('Not Implemented Yet'));
authedRouter.get('/inbox', (req, res) => messagingController.inboxPage(req, res));

authedRouter.post('/structure-upgrades/upgrade', (req, res) => {
  res.json({error: 'Not configured ' + req.body.type });
})

authedRouter.post('/training/train', (req, res) => {
  trainingController.trainUnitsAction(req, res)
});
authedRouter.post('/training/untrain', (req, res) => {
  trainingController.untrainUnitsAction(req, res)
});
authedRouter.post('/armory/equip', (req, res) => {armoryController.equipItemAction(req,res)});
authedRouter.post('/armory/unequip', (req, res) => {armoryController.unequipItemAction(req, res)});

authedRouter.post('/settings', (req, res) => {settingsController.handleSave(req, res)});

router.use(authedRouter);

export default router;
