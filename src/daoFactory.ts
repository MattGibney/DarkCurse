import { Knex } from 'knex';
import UserDao from './daos/user';
import UserSessionDao from './daos/userSession';

class DaoFactory {
  public user: UserDao;
  public userSession: UserSessionDao;

  constructor(database: Knex) {
    this.user = new UserDao(database);
    this.userSession = new UserSessionDao(database);
  }
}

export default DaoFactory;
