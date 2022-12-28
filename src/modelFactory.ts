import BankHistoryModel from './models/bankHistory';
import UserModel from './models/user';
import UserSessionModel from './models/userSession';
import AttackLogModel from './models/attackLog';
import RecruitHistoryModel from './models/recruitHistory';

class ModelFactory {
  public bankHistory: typeof BankHistoryModel;
  public user: typeof UserModel;
  public userSession: typeof UserSessionModel;
  public attackLog: typeof AttackLogModel;
  public recruitHistory: typeof RecruitHistoryModel;

  constructor() {
    this.bankHistory = BankHistoryModel;
    this.user = UserModel;
    this.userSession = UserSessionModel;
    this.attackLog = AttackLogModel;
    this.recruitHistory = RecruitHistoryModel;
  }
}

export default ModelFactory;
