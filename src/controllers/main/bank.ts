import { Request, Response } from 'express';

interface PageAlert {
  type: 'SUCCESS' | 'DANGER';
  message: string;
}

async function bankPage(req: Request, res: Response, alert?: PageAlert) {
  const availableBankDeposits = await req.user.fetchAvailableBankDeposits();

  return res.render('page/main/bank/deposit', {
    layout: 'main',
    pageTitle: 'Bank',
    sidebarData: req.sidebarData,

    gold: new Intl.NumberFormat('en-GB').format(req.user.gold),
    goldInBank: new Intl.NumberFormat('en-GB').format(req.user.goldInBank),

    alert: alert
      ? {
          type: alert.type.toLocaleLowerCase(),
          message: alert.message,
        }
      : null,

    deposits: {
      remaining: availableBankDeposits,
      max: req.user.maximumBankDeposits,
      isMax: availableBankDeposits > 0,
    },
  });
}

async function historyPage(req: Request, res: Response) {
  const history = await req.modelFactory.bankHistory.fetchToUserHistory(
    req.modelFactory,
    req.daoFactory,
    req.logger,
    req.user
  );

  return res.render('page/main/bank/history', {
    layout: 'main',
    pageTitle: 'Bank',
    sidebarData: req.sidebarData,

    history: await Promise.all(
      history.map(async (transaction) => ({
        dateTime: transaction.dateTime.toLocaleDateString(),
        goldAmount: new Intl.NumberFormat('en-GB').format(
          transaction.goldAmount
        ),
        fromPlayerUsername:
          // This is terribly inefficient as it's (n) DB queries.
          (
            await req.modelFactory.user.fetchById(
              req.modelFactory,
              req.daoFactory,
              req.logger,
              transaction.fromUserId
            )
          ).displayName,
        fromPlayerAccount: transaction.fromUserAccount,
        toPlayerUsername:
          // This is terribly inefficient as it's (n) DB queries.
          (
            await req.modelFactory.user.fetchById(
              req.modelFactory,
              req.daoFactory,
              req.logger,
              transaction.toUserId
            )
          ).displayName,
        toPlayerAccount: transaction.toUserAccount,
        type: transaction.historyType,
      }))
    ),
  });
}

/**
 * This controller is never intended to render anything to the user. Instead, it
 * is a stacked controller. Once it finished it's work, it will call the
 * `bankPage` controller to render.
 */
async function bankDepositGold(
  req: Request,
  res: Response,
  bankPageController: (
    req: Request,
    res: Response,
    alert?: PageAlert
  ) => Promise<void>
) {
  const depositAmount = parseInt(req.body.depositAmount);

  if (!depositAmount) {
    return bankPageController(req, res, {
      type: 'DANGER',
      message: 'You must specify an amount to deposit',
    });
  }

  if (depositAmount < 0) {
    return bankPageController(req, res, {
      type: 'DANGER',
      message: 'You cannot deposit a negative amount',
    });
  }

  const availableBankDeposits = await req.user.fetchAvailableBankDeposits();
  if (availableBankDeposits <= 0) {
    return bankPageController(req, res, {
      type: 'DANGER',
      message: 'You have no deposits available.',
    });
  }

  const maximumAllowedDeposit = Math.floor((req.user.gold / 100) * 80);
  if (depositAmount > maximumAllowedDeposit) {
    const maximumGoldString = new Intl.NumberFormat('en-GB').format(
      maximumAllowedDeposit
    );
    return bankPageController(req, res, {
      type: 'DANGER',
      message: `You cannot deposit more than 80% of your gold on hand. The maximum you can deposit is: ${maximumGoldString}`,
    });
  }

  await req.user.subtractGold(depositAmount);
  await req.user.addBankedGold(depositAmount);
  await req.modelFactory.bankHistory.createHistory(
    req.modelFactory,
    req.daoFactory,
    req.logger,
    {
      goldAmount: depositAmount,
      fromUserId: req.user.id,
      fromUserAccount: 'HAND',
      toUserId: req.user.id,
      toUserAccount: 'BANK',
      dateTime: req.dateTime,
      historyType: 'PLAYER_TRANSFER',
    }
  );

  const depositAmountString = new Intl.NumberFormat('en-GB').format(
    depositAmount
  );
  const alert: PageAlert = {
    type: 'SUCCESS',
    message: `Deposited ${depositAmountString} into your bank`,
  };
  return bankPageController(req, res, alert);
}

export default { bankPage, bankDepositGold, historyPage };
