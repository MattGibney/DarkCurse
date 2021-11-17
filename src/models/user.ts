import DaoFactory from '../daoFactory';
import { UserData } from '../daos/user';
import ModelFactory from '../modelFactory';
import WarHistoryModel from './warHistory';

class UserModel {
  private modelFactory: ModelFactory;
  private daoFactory: DaoFactory;

  public id: number;
  public displayName: string;
  public race: 'UNDEAD' | 'HUMAN' | 'GOBLIN' | 'ELF';
  public class: 'FIGHTER' | 'CLERIC' | 'ASSASSIN' | 'THIEF';
  public experience: number;
  public population: number;

  constructor(modelFactory: ModelFactory, daoFactory: DaoFactory, userData: UserData) {
    this.modelFactory = modelFactory;
    this.daoFactory = daoFactory;

    this.id = userData.id;
  }

  get attackLogs(): WarHistoryModel[] {
    return [];
  }

  get defendLogs(): WarHistoryModel[] {
    return [];
  }

  get spyLogs(): WarHistoryModel[] {
    return [];
  }

  get sentryLogs(): WarHistoryModel[] {
    return [];
  }

  static async fetchById(modelFactory: ModelFactory, daoFactory: DaoFactory, id: number): Promise<UserModel> {
    const user = await daoFactory.user.fetchById(id);
    if (!user) return null;
    return new UserModel(modelFactory, daoFactory, user);
  }
}

export default UserModel;