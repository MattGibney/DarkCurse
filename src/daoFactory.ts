import { Knex } from 'knex';
import BankHistoryDao from './daos/bankHistory';
import UserDao from './daos/user';
import UserSessionDao from './daos/userSession';

class DaoFactory {
  public bankHistory: BankHistoryDao;
  public user: UserDao;
  public userSession: UserSessionDao;

  constructor(database: Knex) {
    this.bankHistory = new BankHistoryDao(database);
    this.user = new UserDao(database);
    this.userSession = new UserSessionDao(database);
  }
}

export default DaoFactory;
