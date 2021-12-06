import { Request, Response } from 'express';
import controller from '../../../src/controllers/main/training';
import UserModel from '../../../src/models/user';

describe('Controller: Training', () => {
  describe('trainUnitsAction', () => {
    test('it ignores units that are not available', async () => {
      const mockRequest = {
        body: {
          'WORKER_1': '100',
          'WORKER_2': '1',
        },
        logger: {
          debug: jest.fn().mockReturnThis(),
        },
        user: {
          gold: 0,
          citizens: 0,
          availableUnitTypes: [
            { name: 'Worker', type: 'WORKER', level: 1, bonus: 65, cost: 2000 },
          ]
        } as UserModel
      } as unknown as Request;
      const mockResponse = {} as Response;

      await controller.trainUnitsAction(mockRequest, mockResponse);

      expect(mockRequest.logger.debug).toHaveBeenCalledWith(
        'Units to be trained',
        [{level: 1, quantity: 100, cost: 2000, type: 'WORKER'}]
      );
    });
    it('validates that the requested number of units does not exceed available citizens', async () => {
      const mockRequest = {
        body: {
          'WORKER_1': '100',
        },
        logger: {
          debug: jest.fn().mockReturnThis(),
        },
        user: {
          citizens: 50,
          availableUnitTypes: [
            { name: 'Worker', type: 'WORKER', level: 1, bonus: 65, cost: 2000 },
          ]
        } as UserModel
      } as unknown as Request;
      const mockResponse = {} as Response;

      await controller.trainUnitsAction(mockRequest, mockResponse);

      expect(mockRequest.logger.debug).toHaveBeenCalledWith(
        'Not enough citizens to train requested units',
      );
    });
    it('validates that the cost of requested number of units does not exceed available gold', async () => {
      const mockRequest = {
        body: {
          'WORKER_1': '100',
        },
        logger: {
          debug: jest.fn().mockReturnThis(),
        },
        user: {
          citizens: 500,
          gold: 50,
          availableUnitTypes: [
            { name: 'Worker', type: 'WORKER', level: 1, bonus: 65, cost: 2000 },
          ]
        } as UserModel
      } as unknown as Request;
      const mockResponse = {} as Response;

      await controller.trainUnitsAction(mockRequest, mockResponse);

      expect(mockRequest.logger.debug).toHaveBeenCalledWith(
        'Not enough gold to train requested units',
      );
    });
    it('Subtracts gold and trains units for a sucessful request', async () => {
      const mockRequest = {
        body: {
          'WORKER_1': '2',
        },
        logger: {
          debug: jest.fn().mockReturnThis(),
        },
        user: {
          citizens: 500,
          gold: 5000,
          availableUnitTypes: [
            { name: 'Worker', type: 'WORKER', level: 1, bonus: 65, cost: 2000 },
          ],
          subtractGold: jest.fn().mockReturnThis(),
          trainNewUnits: jest.fn().mockReturnThis(),
        } as unknown as UserModel
      } as unknown as Request;
      const mockResponse = {
        redirect: jest.fn().mockReturnThis(),
      } as unknown as Response;

      await controller.trainUnitsAction(mockRequest, mockResponse);

      expect(mockRequest.logger.debug).toHaveBeenCalledWith(
        'Subtracted gold for training units',
        4000
      );

      expect(mockRequest.user.subtractGold).toHaveBeenCalledWith(4000);

      expect(mockRequest.user.trainNewUnits).toHaveBeenCalledWith([
        {
          level: 1,
          quantity: 2,
          type: 'WORKER',
        }
      ]);

      expect(mockResponse.redirect).toHaveBeenCalledWith('/training');
    });
  });
});