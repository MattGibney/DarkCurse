import UserDao from './daos/user';

class DaoFactory {
  public user: UserDao;

  constructor() {
    this.user = new UserDao();
  }
}

export default DaoFactory;