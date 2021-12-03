import { Knex } from 'knex';
import { ArmyUnit, CivilianUnit, PlayerClass, PlayerRace } from '../../types/typings';

/**
 * This is seesntially documentation for the structure of the data in the
 * database.
 */
interface UserRow {
  id: number;
  display_name: string;
  email: string;
  password_hash: string;
  race: string;
  class: string;
  units: any;
  experience: string;
  gold: string;
  gold_in_bank: string;
  fort_level: number;
  fort_hitpoints: number;
  attack_turns: string;
  created_date: Date;
  updated_date: Date;
}

export interface UserData {
  id: number;
  displayName: string;
  email: string;
  passwordHash: string;
  race: PlayerRace;
  class: PlayerClass;
  units: (ArmyUnit | CivilianUnit)[];
  experience: number;
  gold: number;
  goldInBank: number;
  fortLevel: number;
  fortHitpoints: number;
  attackTurns: number;
}

class UserDao {
  private database: Knex;

  constructor(database: Knex) {
    this.database = database;
  }
  
  async fetchById(id: number): Promise<UserData | null> {
    const userRow = await this.database<UserRow>('users').where({ id: id }).first();
    if (!userRow) return null;
    return this.mapUserRowToUserData(userRow);
  }

  async fetchByEmail(email: string): Promise<UserData | null> {
    const userRow = await this.database<UserRow>('users').where({ email: email }).first();
    if (!userRow) return null;
    return this.mapUserRowToUserData(userRow);
  }

  async fetchAll(): Promise<UserData[]> {
    const userRows = await this.database<UserRow>('users').select();
    return userRows.map(this.mapUserRowToUserData);
  }

  async setGold(userId: number, gold: number): Promise<void> {
    await this.database('users').where({ id: userId }).update({ gold: gold });
  }

  mapUserRowToUserData(userRow: UserRow): UserData {
    return {
      id: userRow.id,
      displayName: userRow.display_name,
      email: userRow.email,
      passwordHash: userRow.password_hash,
      race: userRow.race as PlayerRace,
      class: userRow.class as PlayerClass,
      units: userRow.units,
      experience: parseInt(userRow.experience),
      gold: parseInt(userRow.gold),
      goldInBank: parseInt(userRow.gold_in_bank),
      fortLevel: userRow.fort_level,
      fortHitpoints: userRow.fort_hitpoints,
      attackTurns: parseInt(userRow.attack_turns),
    };
  }
}

export default UserDao;
