import { Knex } from 'knex';

import { v4 as uuidv4 } from 'uuid';

interface UserSessionRow {
  id: number;
  external_id: string;
  user_id: number;
  created_date: Date;
  updated_date: Date;
}

export interface UserSessionData {
  id: number;
  externalId: string;
  userId: number;
}

class UserSessionDao {
  private database: Knex;

  constructor(database: Knex) {
    this.database = database;
  }

  async fetchByExternalId(externalId: string): Promise<UserSessionData | null> {
    const userSessionRow = await this.database<UserSessionRow>('user_sessions')
      .select('*')
      .where({ external_id: externalId })
      .first();
    if (!userSessionRow) return null;

    return this.mapUserSessionRowToUserSessionData(userSessionRow);
  }

  async createSession(userId: number): Promise<UserSessionData> {
    const externalId = uuidv4();
    const newSessionRow = await this.database<UserSessionRow>('user_sessions')
      .insert({
        external_id: externalId,
        user_id: userId,
      })
      .returning('*');
    return this.mapUserSessionRowToUserSessionData(newSessionRow[0]);
  }

  mapUserSessionRowToUserSessionData(userRow: UserSessionRow): UserSessionData {
    return {
      id: userRow.id,
      externalId: userRow.external_id,
      userId: userRow.user_id,
    };
  }
}

export default UserSessionDao;
