import * as express from 'express';

import UserModel from '../../src/models/user';
import Controller from '../../src/controllers/overview'

describe('Controller: Overview', () => {
  describe('overviewPage', () => {
    test('it should return a 404 if the user does not exist.', async () => {
      const mockReq = {
        modelFactory: {
          user: {
            fetchById: jest.fn().mockReturnValue(null)
          }
        },
        daoFactory: {}
      } as unknown as express.Request;
      const mockRes = {
        sendStatus: jest.fn().mockReturnThis()
      } as unknown as express.Response;

      await Controller.overviewPage(mockReq, mockRes);

      expect(mockRes.sendStatus).toHaveBeenCalledWith(404);
    });
    test('it should render the page.', async () => {
      const mockUserModel = {
        displayName: 'Test Name',
        race: 'UNDEAD',
        class: 'FIGHTER',
        population: 1,
        armySize: 2,
        level: 3,
        xpToNextLevel: 4,
        fortHealth: {
          current: 5,
          max: 6,
          percentage: 7
        },
        gold: 8,
        goldPerTurn: 9,
        goldInBank: 10
      } as UserModel;

      const mockReq = {
        modelFactory: {
          user: {
            fetchById: jest.fn().mockReturnValue(mockUserModel)
          }
        },
        daoFactory: {}
      } as unknown as express.Request;
      const mockRes = {
        render: jest.fn().mockReturnThis()
      } as unknown as express.Response;

      await Controller.overviewPage(mockReq, mockRes);

      expect(mockRes.render).toHaveBeenCalledWith('overview', {
        layout: 'main'
      });
    });
  });
});