import { Knex } from 'knex';

export interface RecruitHistoryRow {
  id?: number;
  to_user: number;
  from_user: number;
  timestamp?: Date;
  ip_addr: string;
}

export interface RecruitHistoryData {
  to_user: number;
  from_user: number;
  ip_addr: string;
}

export class RecruitHistoryDao {
  private database: Knex;

  constructor(database: Knex) {
    this.database = database;
  }

  async fetchById(id: number): Promise<RecruitHistoryRow | null> {
    const bankHistoryRow = await this.database<RecruitHistoryRow>(
      'recruit_history'
    )
      .where({ id: id })
      .first();
    if (!bankHistoryRow) return null;
    return bankHistoryRow;
  }

  async fetchToUserHistory(toUserId: number): Promise<RecruitHistoryRow[]> {
    const bankHistoryRows = await this.database<RecruitHistoryRow>(
      'recruit_history'
    )
      .where({ to_user: toUserId })
      .select();
    return bankHistoryRows;
  }

  async fetchCountClicksByIP(ip_addr: string): Promise<number> {
    const clicks = await this.database('recruit_history')
      .where({ ip_addr: ip_addr })
      .andWhere(
        'timestamp',
        '>=',
        // eslint-disable-next-line prettier/prettier
        this.database.raw('now() - (?*\'1 HOUR\'::INTERVAL)', [24])
      )
      .count('id as clicks');
    return Number(clicks[0].clicks);
  }

  async fetchCountClicksByIPtoID(
    ip_addr: string,
    user_id: number
  ): Promise<number> {
    const clicks = await this.database('recruit_history')
      .where({ ip_addr: ip_addr, to_user: user_id })
      .andWhere(
        'timestamp',
        '>=',
        // eslint-disable-next-line prettier/prettier
        this.database.raw('now() - (?*\'1 HOUR\'::INTERVAL)', [22])
      )
      .count('id as clicks');
    return Number(clicks[0].clicks);
  }

  async fetchCountClicksToID(user_id: number): Promise<number> {
    const clicks = await this.database('recruit_history')
      .where({ to_user: user_id })
      .count('id as clicks');
    return Number(clicks[0].clicks);
  }

  async createHistory(
    historyData: RecruitHistoryRow
  ): Promise<RecruitHistoryRow> {
    const newHistoryRow = await this.database<RecruitHistoryRow>(
      'recruit_history'
    )
      .insert({
        to_user: historyData.to_user,
        from_user: historyData.from_user,
        ip_addr: historyData.ip_addr,
      })
      .returning('*');
    return newHistoryRow[0];
  }
}

export default RecruitHistoryDao;
