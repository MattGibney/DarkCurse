export interface UserData {
  id: number;
}

const mockUserData: UserData[] = [];

class UserDao {
  async fetchById(id: number): Promise<UserData> {
    return mockUserData.find(user => user.id === id);
  }
}

export default UserDao;