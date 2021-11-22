import UserDao from './daos/user';
import UserSessionDao from './daos/userSession';

class DaoFactory {
  public user: UserDao;
  public userSession: UserSessionDao;

  constructor() {
    this.user = new UserDao();
    this.userSession = new UserSessionDao();
  }
}

export default DaoFactory;