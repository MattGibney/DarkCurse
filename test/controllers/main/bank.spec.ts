import { Request, Response } from 'express';
import BankController from '../../../src/controllers/main/bank';

describe('Controller: Bank', () => {
  describe('bankPage', () => {
    test('it renders the correct page with the correct data', async () => {
      const mockReq = {
        sidebarData: {},
        user: {
          gold: 1000,
          goldInBank: 2000,
          maximumBankDeposits: 1,
          fetchAvailableBankDeposits: jest.fn().mockResolvedValue(1),
        },
      } as unknown as Request;
      const mockRes = {
        render: jest.fn().mockReturnThis(),
      } as unknown as Response;

      await BankController.bankPage(mockReq, mockRes);

      expect(mockReq.user.fetchAvailableBankDeposits).toHaveBeenCalled();

      expect(mockRes.render).toHaveBeenCalledWith('page/main/bank', {
        layout: 'main',
        pageTitle: 'Bank',
        sidebarData: mockReq.sidebarData,

        gold: '1,000',
        goldInBank: '2,000',

        alert: null,

        deposits: {
          remaining: 1,
          max: 1,
          isMax: true,
        },
      });
    });
  });
  describe('bankDepositGold', () => {
    test('it fails nicely with a missing deposit amount', async () => {
      const mockReq = {
        body: {},
      } as unknown as Request;
      const mockRes = {} as unknown as Response;
      const mockBankPage = jest.fn().mockReturnThis();
      await BankController.bankDepositGold(mockReq, mockRes, mockBankPage);

      expect(mockBankPage).toHaveBeenCalledWith(mockReq, mockRes, {
        type: 'DANGER',
        message: 'You must specify an amount to deposit',
      });
    });
    test('it fails nicely with a negative deposit amount', async () => {
      const mockReq = {
        body: {
          depositAmount: '-1',
        },
      } as unknown as Request;
      const mockRes = {} as unknown as Response;
      const mockBankPage = jest.fn().mockReturnThis();
      await BankController.bankDepositGold(mockReq, mockRes, mockBankPage);

      expect(mockBankPage).toHaveBeenCalledWith(mockReq, mockRes, {
        type: 'DANGER',
        message: 'You cannot deposit a negative amount',
      });
    });
    test('it fails nicely with no remaining deposits', async () => {
      const mockReq = {
        user: {
          fetchAvailableBankDeposits: jest.fn().mockResolvedValue(0),
        },
        body: {
          depositAmount: '1',
        },
      } as unknown as Request;
      const mockRes = {} as unknown as Response;
      const mockBankPage = jest.fn().mockReturnThis();
      await BankController.bankDepositGold(mockReq, mockRes, mockBankPage);

      expect(mockBankPage).toHaveBeenCalledWith(mockReq, mockRes, {
        type: 'DANGER',
        message: 'You have no deposits available.',
      });
    });
    test('it fails nicely if the player attempts to deposit more than 80% of hand gold', async () => {
      const mockReq = {
        user: {
          gold: 10,
          fetchAvailableBankDeposits: jest.fn().mockResolvedValue(1),
        },
        body: {
          depositAmount: '9',
        },
      } as unknown as Request;
      const mockRes = {} as unknown as Response;
      const mockBankPage = jest.fn().mockReturnThis();
      await BankController.bankDepositGold(mockReq, mockRes, mockBankPage);

      expect(mockBankPage).toHaveBeenCalledWith(mockReq, mockRes, {
        type: 'DANGER',
        message:
          'You cannot deposit more than 80% of your gold on hand. The maximum you can deposit is: 8',
      });
    });
    test('it fails nicely if the player attempts to deposit more than 80% of hand gold', async () => {
      const mockReq = {
        user: {
          id: 111,
          gold: 10,
          fetchAvailableBankDeposits: jest.fn().mockResolvedValue(1),
          subtractGold: jest.fn(),
          addBankedGold: jest.fn(),
        },
        dateTime: new Date(),
        modelFactory: {
          bankHistory: {
            createHistory: jest.fn(),
          },
        },
        logger: {},
        body: {
          depositAmount: '8',
        },
      } as unknown as Request;
      const mockRes = {} as unknown as Response;
      const mockBankPage = jest.fn().mockReturnThis();
      await BankController.bankDepositGold(mockReq, mockRes, mockBankPage);

      expect(mockReq.user.subtractGold).toHaveBeenCalledWith(8);
      expect(mockReq.user.addBankedGold).toHaveBeenCalledWith(8);
      expect(
        mockReq.modelFactory.bankHistory.createHistory
      ).toHaveBeenCalledWith(
        mockReq.modelFactory,
        mockReq.daoFactory,
        mockReq.logger,
        {
          goldAmount: 8,
          fromUserId: 111,
          fromUserAccount: 'HAND',
          toUserId: 111,
          toUserAccount: 'BANK',
          dateTime: mockReq.dateTime,
          historyType: 'PLAYER_TRANSFER',
        }
      );

      expect(mockBankPage).toHaveBeenCalledWith(mockReq, mockRes, {
        type: 'SUCCESS',
        message: 'Deposited 8 into your bank',
      });
    });
  });
});
