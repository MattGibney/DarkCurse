import { Request, Response } from 'express';
import LoginController from '../../../src/controllers/marketing/login';
import UserModel from '../../../src/models/user';

describe('Controller: Auth', () => {
  describe('loginAction', () => {
    test('it validates the email param', async () => {
      const mockRequest = {
        body: {
          password: 'password',
        }
      } as Request;
      const mockResponse = {
        render: jest.fn().mockReturnThis(),
      } as unknown as Response;

      await LoginController.loginAction(mockRequest, mockResponse);

      expect(mockResponse.render)
        .toHaveBeenCalledWith('login', {
          layout: 'auth',
          errorMessage: 'Email and password are mandatory'
        });
    });
    test('it validates the password param', async () => {
      const mockRequest = {
        body: {
          email: 'email',
        }
      } as Request;
      const mockResponse = {
        render: jest.fn().mockReturnThis(),
      } as unknown as Response;

      await LoginController.loginAction(mockRequest, mockResponse);

      expect(mockResponse.render)
        .toHaveBeenCalledWith('login', {
          layout: 'auth',
          errorMessage: 'Email and password are mandatory'
        });
    });
    test('returns an error if the email is not recognised', async () => {
      const mockRequest = {
        modelFactory: {
          user: {
            fetchByEmail: jest.fn().mockReturnValue(null),
          }
        },
        body: {
          email: 'email',
          password: 'password'
        }
      } as unknown as Request;
      const mockResponse = {
        render: jest.fn().mockReturnThis(),
      } as unknown as Response;

      await LoginController.loginAction(mockRequest, mockResponse);

      expect(mockResponse.render)
        .toHaveBeenCalledWith('login', {
          layout: 'auth',
          errorMessage: 'Email or password not recognised'
        });
    });
    test('returns an error if the password is incorrect', async () => {
      const mockUserModel = {
        validatePassword: jest.fn().mockReturnValue(false),
      } as unknown as UserModel;
      const mockRequest = {
        modelFactory: {
          user: {
            fetchByEmail: jest.fn().mockReturnValue(mockUserModel),
          }
        },
        body: {
          email: 'email',
          password: 'password'
        }
      } as unknown as Request;
      const mockResponse = {
        render: jest.fn().mockReturnThis(),
      } as unknown as Response;

      await LoginController.loginAction(mockRequest, mockResponse);

      expect(mockResponse.render)
        .toHaveBeenCalledWith('login', {
          layout: 'auth',
          errorMessage: 'Email or password not recognised'
        });
    });
  });
});
