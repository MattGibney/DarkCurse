import { Request, Response } from 'express';
import pino from 'pino';

import middleware from '../src/middleware';

describe('Middleware', () => {
  describe('authenticate', () => {
    it('should log and skip if there is no JWT cookie present', async () => {
      const mockRequest = {
        cookies: {},
        logger: {
          debug: jest.fn(),
        } as unknown as pino.Logger,
      } as unknown as Request;
      const mockResponse = {} as Response;
      const mockNext = jest.fn();

      await middleware.authenticate(mockRequest, mockResponse, mockNext);

      expect(mockRequest.logger.debug)
        .toHaveBeenCalledWith('Request does not contain a JWT');
    });
    it('should decode a valid token and skips if it cannot fetch the session', async () => {
      const mockRequest = {
        modelFactory: {
          userSession: {
            fetchByExternalId: jest.fn().mockResolvedValue(null),
          },
        },
        daoFactory: {},
        config: {
          jwtSecret: 'TOKENSECRET'
        },
        cookies: {
          DCT: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImVlZDliMWVjLWUzYzMtNGVlZi1hMzIwLTUxOThjNzZiYjFiZSIsImlhdCI6MTYzNzY3OTA1N30.fB8Axb-t35mTKe-MK6Fwv1WrSjbMbIEJPDsTICbWCVI'
        },
        logger: {
          debug: jest.fn(),
        } as unknown as pino.Logger,
      } as unknown as Request;
      const mockResponse = {} as Response;
      const mockNext = jest.fn();

      await middleware.authenticate(mockRequest, mockResponse, mockNext);

      expect(mockRequest.logger.debug).toHaveBeenCalledWith(
        'Request contains a valid JWT with sessionId: eed9b1ec-e3c3-4eef-a320-5198c76bb1be'
      );
      expect(mockRequest.modelFactory.userSession.fetchByExternalId).toHaveBeenCalledWith(
        mockRequest.modelFactory,
        mockRequest.daoFactory,
        'eed9b1ec-e3c3-4eef-a320-5198c76bb1be'
      );
      expect(mockRequest.logger.debug).toHaveBeenCalledWith(
        'No valid session found for JWT',
        {
          sessionId: 'eed9b1ec-e3c3-4eef-a320-5198c76bb1be'
        }
      );
    });
    it('should return an error if there is no user for the session', async () => {
      const mockUserSession = {
        user: Promise.resolve(null),
      };
      const mockRequest = {
        modelFactory: {
          userSession: {
            fetchByExternalId: jest.fn().mockResolvedValue(mockUserSession),
          },
        },
        daoFactory: {},
        config: {
          jwtSecret: 'TOKENSECRET'
        },
        cookies: {
          DCT: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImVlZDliMWVjLWUzYzMtNGVlZi1hMzIwLTUxOThjNzZiYjFiZSIsImlhdCI6MTYzNzY3OTA1N30.fB8Axb-t35mTKe-MK6Fwv1WrSjbMbIEJPDsTICbWCVI'
        },
        logger: {
          debug: jest.fn(),
          error: jest.fn(),
        } as unknown as pino.Logger,
      } as unknown as Request;
      const mockResponse = {} as Response;
      const mockNext = jest.fn();

      await middleware.authenticate(mockRequest, mockResponse, mockNext);

      expect(mockRequest.logger.debug).toHaveBeenCalledWith(
        'Request contains a valid JWT with sessionId: eed9b1ec-e3c3-4eef-a320-5198c76bb1be'
      );
      
      expect(mockRequest.logger.error).toHaveBeenCalledWith(
        'Unable to fetch client for session',
        {
          sessionId: 'eed9b1ec-e3c3-4eef-a320-5198c76bb1be'
        }
      );
    });
    it('should set the user on the request if valid', async () => {
      const mockUser = { id: '111' };
      const mockUserSession = {
        user: Promise.resolve(mockUser),
      };
      const mockRequest = {
        modelFactory: {
          userSession: {
            fetchByExternalId: jest.fn().mockResolvedValue(mockUserSession),
          },
        },
        daoFactory: {},
        config: {
          jwtSecret: 'TOKENSECRET'
        },
        cookies: {
          DCT: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImVlZDliMWVjLWUzYzMtNGVlZi1hMzIwLTUxOThjNzZiYjFiZSIsImlhdCI6MTYzNzY3OTA1N30.fB8Axb-t35mTKe-MK6Fwv1WrSjbMbIEJPDsTICbWCVI'
        },
        logger: {
          debug: jest.fn(),
        } as unknown as pino.Logger,
      } as unknown as Request;
      const mockResponse = {} as Response;
      const mockNext = jest.fn();

      await middleware.authenticate(mockRequest, mockResponse, mockNext);

      expect(mockRequest.logger.debug).toHaveBeenCalledTimes(2);

      expect(mockRequest.logger.debug).toHaveBeenCalledWith(
        'Request contains a valid JWT with sessionId: eed9b1ec-e3c3-4eef-a320-5198c76bb1be'
      );
      
      expect(mockRequest.logger.debug).toHaveBeenCalledWith(
        'Found client for session',
        {
          sessionId: 'eed9b1ec-e3c3-4eef-a320-5198c76bb1be',
          userId: '111'
        }
      );

      expect(mockRequest.user).toEqual(mockUser);
    });
    it('should catch errors thrown by JWT decode and clear the offending cookie', async () => {
      const mockRequest = {
        config: {
          jwtSecret: 'TOKENSECRET'
        },
        cookies: {
          DCT: 'THIS_IS_A_COOKIE'
        },
        logger: {
          error: jest.fn(),
        } as unknown as pino.Logger,
      } as unknown as Request;
      const mockResponse = {
        clearCookie: jest.fn().mockReturnThis(),
      } as unknown as Response;
      const mockNext = jest.fn();

      await middleware.authenticate(mockRequest, mockResponse, mockNext);

      expect(mockResponse.clearCookie).toHaveBeenCalledWith('DCT');

      expect(mockRequest.logger.error)
        .toHaveBeenCalledWith('Request JWT invalid', {
          error: "jwt malformed"
        });
    });
  });
});
