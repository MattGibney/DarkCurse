import { ArmyUnit, CivilianUnit, PlayerClass, PlayerRace } from '../../types/typings';

export interface UserData {
  id: number;
  displayName: string;
  race: PlayerRace;
  class: PlayerClass;
  units: (ArmyUnit | CivilianUnit)[];
  experience: number;
  gold: number;
  goldInBank: number;
  fortLevel: number;
  fortHitpoints: number;
}

const mockUserData: UserData[] = [
  {
    id: 1,
    displayName: 'John Doe',
    race: 'UNDEAD',
    class: 'FIGHTER',
    units: [
      { unitType: 'CITIZEN', quantity: 1 },
      { unitType: 'WORKER',  quantity: 2 },
      { unitType: 'OFFENSE', quantity: 3, unitLevel: 1 },
      { unitType: 'DEFENSE', quantity: 4, unitLevel: 1 },
      { unitType: 'SPY',     quantity: 5, unitLevel: 1 },
      { unitType: 'SENTRY',  quantity: 6, unitLevel: 1 }
    ],
    experience: 150,
    gold: 1000,
    goldInBank: 2000,
    fortLevel: 1,
    fortHitpoints: 90
  }
];

class UserDao {
  async fetchById(id: number): Promise<UserData> {
    return mockUserData.find(user => user.id === id);
  }
}

export default UserDao;