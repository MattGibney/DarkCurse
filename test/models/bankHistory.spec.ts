import pino from 'pino';
import DaoFactory from '../../src/daoFactory';
import { BankHistoryData } from '../../src/daos/bankHistory';
import ModelFactory from '../../src/modelFactory';
import BankHistoryModel from '../../src/models/bankHistory';
import UserModel from '../../src/models/user';

describe('Model: BankHistory', () => {
  // describe('Dynamic methods', () => {});
  describe('Static methods', () => {
    describe('fetchToUserHistoryForLastTwentyFourHours', () => {
      test('it only includes history for the last 24 hours', async () => {
        const mockModelFactory = {} as ModelFactory;
        const mockDaoFactory = {
          bankHistory: {
            fetchToUserHistory: jest.fn().mockResolvedValue([
              { dateTime: new Date() }, // Some history for now
              {
                dateTime: new Date(new Date().getTime() - 25 * 60 * 60 * 1000),
              }, // History for 25 hours ago
            ] as BankHistoryData[]),
          },
        } as unknown as DaoFactory;
        const mockLogger = {} as pino.Logger;

        const mockUser = {} as UserModel;

        const history =
          await BankHistoryModel.fetchToUserHistoryForLastTwentyFourHours(
            mockModelFactory,
            mockDaoFactory,
            mockLogger,
            mockUser
          );

        expect(history.length).toBe(1);
        expect(history[0]).toBeInstanceOf(BankHistoryModel);
      });
    });
    describe('createHistory', () => {
      test('it creates a new history record and returns an instance of BankHistory', async () => {
        const mockModelFactory = {} as ModelFactory;
        const mockDaoFactory = {
          bankHistory: {
            createHistory: jest.fn().mockResolvedValue({} as BankHistoryData),
          },
        } as unknown as DaoFactory;
        const mockLogger = {} as pino.Logger;

        const newHistoryData = {} as BankHistoryData;

        const newHistory = await BankHistoryModel.createHistory(
          mockModelFactory,
          mockDaoFactory,
          mockLogger,
          newHistoryData
        );

        expect(newHistory).toBeInstanceOf(BankHistoryModel);
      });
    });
  });
});
