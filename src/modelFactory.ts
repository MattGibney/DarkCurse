import BankHistoryModel from './models/bankHistory';
import UserModel from './models/user';
import UserSessionModel from './models/userSession';

class ModelFactory {
  public bankHistory: typeof BankHistoryModel;
  public user: typeof UserModel;
  public userSession: typeof UserSessionModel;

  constructor() {
    this.bankHistory = BankHistoryModel;
    this.user = UserModel;
    this.userSession = UserSessionModel;
  }
}

export default ModelFactory;
