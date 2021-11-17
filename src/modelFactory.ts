import UserModel from './models/user';

class ModelFactory {
  public user: typeof UserModel;

  constructor() {
    this.user = UserModel;
  }
}

export default ModelFactory;