import BankHistoryModel from './models/bankHistory';
import UserModel from './models/user';
import UserSessionModel from './models/userSession';
import AttackLogModel from './models/attackLog';

class ModelFactory {
  public bankHistory: typeof BankHistoryModel;
  public user: typeof UserModel;
  public userSession: typeof UserSessionModel;
  public attackLog: typeof AttackLogModel;

  constructor() {
    this.bankHistory = BankHistoryModel;
    this.user = UserModel;
    this.userSession = UserSessionModel;
    this.attackLog = AttackLogModel;
  }
}

export default ModelFactory;
