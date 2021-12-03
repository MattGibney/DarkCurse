import pino from 'pino';

import DaoFactory from '../../src/daoFactory';
import { UserData } from '../../src/daos/user';
import ModelFactory from '../../src/modelFactory';
import UserModel from '../../src/models/user';

describe('Model: User', () => {
  describe('Dynamic methods', () => {
    describe('get population', () => {
      test('it calculates correctly', () => {
        const mockModelFactory = {} as ModelFactory;
        const mockDaoFactory = {} as DaoFactory;
        const mockLogger = {} as pino.Logger;
        const mockData = {
          units: [
            { unitType: 'CITIZEN', quantity: 1 },
            { unitType: 'WORKER',  quantity: 2 },
            { unitLevel: 1, unitType: 'OFFENSE', quantity: 3 },
            { unitLevel: 1, unitType: 'DEFENSE', quantity: 4 },
            { unitLevel: 1, unitType: 'SPY',     quantity: 5 },
            { unitLevel: 1, unitType: 'SENTRY',  quantity: 6 }
          ]
        } as UserData;

        const user = new UserModel(mockModelFactory, mockDaoFactory, mockLogger, mockData);

        expect(user.population).toBe(21);
      });
    });
    describe('get armySize', () => {
      test('it calculates correctly', () => {
        const mockModelFactory = {} as ModelFactory;
        const mockDaoFactory = {} as DaoFactory;
        const mockLogger = {} as pino.Logger;
        const mockData = {
          units: [
            { unitType: 'CITIZEN', quantity: 1 },
            { unitType: 'WORKER',  quantity: 2 },
            { unitLevel: 1, unitType: 'OFFENSE', quantity: 3 },
            { unitLevel: 1, unitType: 'DEFENSE', quantity: 4 },
            { unitLevel: 1, unitType: 'SPY',     quantity: 5 },
            { unitLevel: 1, unitType: 'SENTRY',  quantity: 6 }
          ]
        } as UserData;

        const user = new UserModel(mockModelFactory, mockDaoFactory, mockLogger, mockData);

        expect(user.armySize).toBe(18);
      });
    });
    describe('get citizens', () => {
      test('it calculates correctly', () => {
        const mockModelFactory = {} as ModelFactory;
        const mockDaoFactory = {} as DaoFactory;
        const mockLogger = {} as pino.Logger;
        const mockData = {
          units: [
            { unitType: 'CITIZEN', quantity: 1 },
            { unitType: 'WORKER',  quantity: 2 },
            { unitLevel: 1, unitType: 'OFFENSE', quantity: 3 },
            { unitLevel: 1, unitType: 'DEFENSE', quantity: 4 },
            { unitLevel: 1, unitType: 'SPY',     quantity: 5 },
            { unitLevel: 1, unitType: 'SENTRY',  quantity: 6 }
          ]
        } as UserData;

        const user = new UserModel(mockModelFactory, mockDaoFactory, mockLogger, mockData);

        expect(user.citizens).toBe(1);
      });
    });
    describe('get goldPerTurn', () => {
      test('it calculates correctly', () => {
        const mockModelFactory = {} as ModelFactory;
        const mockDaoFactory = {} as DaoFactory;
        const mockLogger = {} as pino.Logger;
        const mockData = {
          units: [{ unitType: 'WORKER',  quantity: 2 }]
        } as UserData;

        const user = new UserModel(mockModelFactory, mockDaoFactory, mockLogger, mockData);

        expect(user.goldPerTurn).toBe(100);
      });
      test('it works correctly if there are no WORKER units', () => {
        const mockModelFactory = {} as ModelFactory;
        const mockDaoFactory = {} as DaoFactory;
        const mockLogger = {} as pino.Logger;
        const mockData = {
          units: []
        } as UserData;

        const user = new UserModel(mockModelFactory, mockDaoFactory, mockLogger, mockData);

        expect(user.goldPerTurn).toBe(0);
      });
    });
    describe('get level', () => {
      test('it calculates correctly', () => {
        const mockModelFactory = {} as ModelFactory;
        const mockDaoFactory = {} as DaoFactory;
        const mockLogger = {} as pino.Logger;
        const mockData = {
          experience: 199,
        } as UserData;

        const user = new UserModel(mockModelFactory, mockDaoFactory, mockLogger, mockData);

        expect(user.level).toBe(1);
      });
      test('it finds the correct level with XP is exact', () => {
        const mockModelFactory = {} as ModelFactory;
        const mockDaoFactory = {} as DaoFactory;
        const mockLogger = {} as pino.Logger;
        const mockData = {
          experience: 201,
        } as UserData;

        const user = new UserModel(mockModelFactory, mockDaoFactory, mockLogger, mockData);

        expect(user.level).toBe(2);
      });
      test('does not return an error with 0 experience', () => {
        const mockModelFactory = {} as ModelFactory;
        const mockDaoFactory = {} as DaoFactory;
        const mockLogger = {} as pino.Logger;
        const mockData = {
          experience: 0,
        } as UserData;

        const user = new UserModel(mockModelFactory, mockDaoFactory, mockLogger, mockData);

        expect(user.level).toBe(1);
      });
    });
    describe('get xpToNextLevel', () => {
      test('it calculates correctly', () => {
        const mockModelFactory = {} as ModelFactory;
        const mockDaoFactory = {} as DaoFactory;
        const mockLogger = {} as pino.Logger;
        const mockData = {
          experience: 150,
        } as UserData;

        const user = new UserModel(mockModelFactory, mockDaoFactory, mockLogger, mockData);

        expect(user.xpToNextLevel).toBe(50);
      });
    });
    describe('get fortHealth', () => {
      test('it calculates correctly', () => {
        const mockModelFactory = {} as ModelFactory;
        const mockDaoFactory = {} as DaoFactory;
        const mockLogger = {} as pino.Logger;
        const mockData = {
          fortHitpoints: 50,
          fortLevel: 1
        } as UserData;

        const user = new UserModel(mockModelFactory, mockDaoFactory, mockLogger, mockData);

        expect(user.fortHealth).toMatchObject({
          current: 50,
          max: 50,
          percentage: 100
        });
      });
    });
    describe('get availableUnitTypes', () => {
      test('it only returns level 1 units', () => {
        const mockModelFactory = {} as ModelFactory;
        const mockDaoFactory = {} as DaoFactory;
        const mockLogger = {} as pino.Logger;
        const mockData = {} as UserData;

        const user = new UserModel(mockModelFactory, mockDaoFactory, mockLogger, mockData);

        expect(user.availableUnitTypes).toMatchObject([
          { name: 'Worker',      type: 'WORKER',  level: 1, bonus: 65, cost: 2000 },
          { name: 'Soldier',     type: 'OFFENSE', level: 1, bonus: 3,  cost: 1500 },
          { name: 'Guard',       type: 'DEFENSE', level: 1, bonus: 3,  cost: 1500 },
          { name: 'Spy',         type: 'SPY',     level: 1, bonus: 3,  cost: 1500 },
          { name: 'Sentry',      type: 'SENTRY',  level: 1, bonus: 3,  cost: 1500 },
        ]);
      });
    });
    describe('validatePassword', () => {
      test('it returns false when the provided password is not valid', async () => {
        const mockModelFactory = {} as ModelFactory;
        const mockDaoFactory = {} as DaoFactory;
        const mockLogger = {} as pino.Logger;
        const mockData = {
          passwordHash: 'password',
        } as unknown as UserData;

        const user = new UserModel(mockModelFactory, mockDaoFactory, mockLogger, mockData);

        expect(await user.validatePassword('wrong password')).toBe(false);
      });
      test('it returns true when the provided password is valid', async () => {
        const mockModelFactory = {} as ModelFactory;
        const mockDaoFactory = {} as DaoFactory;
        const mockLogger = {} as pino.Logger;
        const mockData = {
          passwordHash: '$2b$10$Zdf/HbQm4.CzYUoj1FoY5O9ng0GxJumavLpgPCqMDaTL4gc7Ntc0S',
        } as unknown as UserData;

        const user = new UserModel(mockModelFactory, mockDaoFactory, mockLogger, mockData);

        expect(await user.validatePassword('password')).toBe(true);
      });
    });
  });
  describe('Static methods', () => {
    describe('fetchById', () => {
      test('it resolves an instance of UserModel', async () => {
        const mockModelFactory = {} as ModelFactory;
        const mockDaoFactory = {
          user: {
            fetchById: jest.fn().mockResolvedValue({}),
          }
        } as unknown as DaoFactory;
        const mockLogger = {} as pino.Logger;

        const user = await UserModel.fetchById(
          mockModelFactory,
          mockDaoFactory,
          mockLogger,
          999
        );
        expect(user).toBeInstanceOf(UserModel);
      });
      test('it returns null when the requested user does not exist', async () => {
        const mockModelFactory = {} as ModelFactory;
        const mockDaoFactory = {
          user: {
            fetchById: jest.fn().mockResolvedValue(null),
          }
        } as unknown as DaoFactory;
        const mockLogger = {} as pino.Logger;

        const user = await UserModel.fetchById(
          mockModelFactory,
          mockDaoFactory,
          mockLogger,
          999
        );
        expect(user).toBeNull();
      })
    });
    describe('fetchByEmail', () => {
      test('it resolves an instance of UserModel', async () => {
        const mockModelFactory = {} as ModelFactory;
        const mockDaoFactory = {
          user: {
            fetchByEmail: jest.fn().mockResolvedValue({}),
          }
        } as unknown as DaoFactory;
        const mockLogger = {} as pino.Logger;

        const user = await UserModel.fetchByEmail(
          mockModelFactory,
          mockDaoFactory,
          mockLogger,
          'email@example.com'
        );
        expect(user).toBeInstanceOf(UserModel);
      });
      test('it returns null when the requested user does not exist', async () => {
        const mockModelFactory = {} as ModelFactory;
        const mockDaoFactory = {
          user: {
            fetchByEmail: jest.fn().mockResolvedValue(null),
          }
        } as unknown as DaoFactory;
        const mockLogger = {} as pino.Logger;

        const user = await UserModel.fetchByEmail(
          mockModelFactory,
          mockDaoFactory,
          mockLogger,
          'email@example.com'
        );
        expect(user).toBeNull();
      })
    });
  });
});
