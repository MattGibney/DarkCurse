import DaoFactory from '../../src/daoFactory';
import ModelFactory from '../../src/modelFactory';
import UserModel from '../../src/models/user';

describe('UserModel', () => {
  describe('Static methods', () => {
    describe('fetchById', () => {
      test('it resolves an instance of UserModel', async () => {
        const mockModelFactory = {} as ModelFactory;
        const mockDaoFactory = {
          user: {
            fetchById: jest.fn().mockResolvedValue({}),
          }
        } as DaoFactory;

        const user = await UserModel.fetchById(
          mockModelFactory,
          mockDaoFactory,
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
        } as DaoFactory;

        const user = await UserModel.fetchById(
          mockModelFactory,
          mockDaoFactory,
          999
        );
        expect(user).toBeNull();
      })
    });
  });
});
