import { Knex } from 'knex';
import AttackLogDao from './daos/attackLog';
import BankHistoryDao from './daos/bankHistory';
import UserDao from './daos/user';
import UserSessionDao from './daos/userSession';
import RecruitHistoryDao from './daos/recruitHistory';

class DaoFactory {
  public bankHistory: BankHistoryDao;
  public user: UserDao;
  public userSession: UserSessionDao;
  public attackLog: AttackLogDao;
  public recruitHistory: RecruitHistoryDao;

  constructor(database: Knex) {
    this.bankHistory = new BankHistoryDao(database);
    this.user = new UserDao(database);
    this.userSession = new UserSessionDao(database);
    this.attackLog = new AttackLogDao(database);
    this.recruitHistory = new RecruitHistoryDao(database);
  }
}

export default DaoFactory;
