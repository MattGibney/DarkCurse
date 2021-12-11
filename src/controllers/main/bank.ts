import { Request, Response } from 'express';

interface PageAlert {
  type: 'SUCCESS' | 'DANGER';
  message: string;
}

function bankPage(req: Request, res: Response, alert?: PageAlert) {
  return res.render('page/main/bank', {
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
      remaining: req.user.availableBankDeposits,
      max: req.user.maximumBankDeposits,
      isMax: req.user.availableBankDeposits > 0,
    },
  });
}

async function bankDepositGold(req: Request, res: Response) {
  const depositAmount = parseInt(req.body.depositAmount);

  if (depositAmount < 0) {
    return bankPage(req, res, {
      type: 'DANGER',
      message: 'You cannot deposit a negative amount',
    });
  }

  const maximumAllowedDeposit = Math.floor((req.user.gold / 100) * 80);
  if (depositAmount > maximumAllowedDeposit) {
    const maximumGoldString = new Intl.NumberFormat('en-GB').format(
      maximumAllowedDeposit
    );
    return bankPage(req, res, {
      type: 'DANGER',
      message: `You cannot deposit more than 80% of your gold on hand. The maximum you can deposit is: ${maximumGoldString}`,
    });
  }

  await req.user.subtractGold(depositAmount);
  await req.user.addBankedGold(depositAmount);

  const depositAmountString = new Intl.NumberFormat('en-GB').format(
    depositAmount
  );
  const alert: PageAlert = {
    type: 'SUCCESS',
    message: `Deposited ${depositAmountString} into your bank`,
  };
  return bankPage(req, res, alert);
}

export default { bankPage, bankDepositGold };
