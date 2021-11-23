import { Knex } from 'knex';

const { v4: uuidv4 } = require('uuid');

export interface UserSessionData {
  externalId: string;
  userId: number;
}

const mockSessionData: UserSessionData[] = [
];

class UserSessionDao {
  private database: Knex;

  constructor(database: Knex) {
    this.database = database;
  }
  
  async fetchByExternalId(externalId: string): Promise<UserSessionData | null> {
    return mockSessionData
      .find(session => session.externalId === externalId) || null;
  }

  async createSession(userId: number): Promise<UserSessionData> {
    const session = {
      externalId: uuidv4(),
      userId,
    };

    mockSessionData.push(session);

    return session;
  }
}

export default UserSessionDao;