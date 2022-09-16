import { Knex } from 'knex';
import { BankAccountType, BankTransferHistoryType } from '../../types/typings';

interface AttackLogRow {
  id: number;
  /**
   * Stored as a string. In Postgres it's a bigint column, knex returns these as
   * strings.
   */
  attacker_id: number;
  defender_id: number;
  timestamp: Date;
  winner: number;
  stats: string;
}

export interface AttackLogData {
  id?: number;
  attacker_id: number;
  defender_id: number;
  timestamp: Date;
  winner: number;
  stats: AttackLogStats[];
}

export type AttackLogStats = {
  offensePoints: number;
  defensePoints: number;
  pillagedGold: number;
  xpEarned: number;
  offenseXPStart: number;
};

class AttackLogDao {
  private database: Knex;

  constructor(database: Knex) {
    this.database = database;
  }

  async fetchById(id: number): Promise<AttackLogData | null> {
    const AttackLogRow = await this.database<AttackLogRow>('attack_log')
      .where({ id: id })
      .first();
    if (!AttackLogRow) return null;
    return this.mapAttackLogRowToAttackLogData(AttackLogRow);
  }

  async fetchUserDefenseHistory(defenderId: number): Promise<AttackLogData[]> {
    const AttackLogRows = await this.database<AttackLogRow>('attack_log')
      .where({ defender_id: defenderId })
      .select();
    return AttackLogRows.map((historyRow) =>
      this.mapAttackLogRowToAttackLogData(historyRow)
    );
  }

  async fetchUserOffenseHistory(attackerId: number): Promise<AttackLogData[]> {
    const AttackLogRows = await this.database<AttackLogRow>('attack_log')
      .where({ attacker_id: attackerId })
      .select();
    return AttackLogRows.map((historyRow) =>
      this.mapAttackLogRowToAttackLogData(historyRow)
    );
  }

  async createHistory(logData: AttackLogData): Promise<AttackLogData> {
    console.log(JSON.stringify(logData.stats));
    const newHistoryRow = await this.database<AttackLogRow>('attack_log')
      .insert({
        attacker_id: logData.attacker_id,
        defender_id: logData.defender_id,
        stats:
          typeof logData.stats === 'string'
            ? JSON.parse(logData.stats[0])
            : JSON.stringify(logData.stats[0]),
        timestamp: logData.timestamp,
        winner: logData.winner,
      })
      .returning('*');
    return this.mapAttackLogRowToAttackLogData(newHistoryRow[0]);
  }

  private mapAttackLogRowToAttackLogData(
    AttackLogRow: AttackLogRow
  ): AttackLogData {
    return {
      id: AttackLogRow.id,
      attacker_id: AttackLogRow.attacker_id,
      defender_id: AttackLogRow.defender_id,
      winner: AttackLogRow.winner,
      timestamp: AttackLogRow.timestamp,
      stats:
        typeof AttackLogRow.stats === 'string'
          ? JSON.parse(AttackLogRow.stats)
          : AttackLogRow.stats,
    };
  }
}

export default AttackLogDao;
