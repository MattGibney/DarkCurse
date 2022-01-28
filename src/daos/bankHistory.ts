import { Knex } from 'knex';
import { BankAccountType, BankTransferHistoryType } from '../../types/typings';

interface BankHistoryRow {
  id: number;
  /**
   * Stored as a string. In Postgres it's a bigint column, knex returns these as
   * strings.
   */
  gold_amount: string;
  from_user_id: number;
  from_user_account_type: string;
  to_user_id: number;
  to_user_account_type: string;
  date_time: Date;
  history_type: string;
}

export interface BankHistoryData {
  id?: number;
  goldAmount: number;
  fromUserId: number;
  fromUserAccount: BankAccountType;
  toUserId: number;
  toUserAccount: BankAccountType;
  dateTime: Date;
  historyType: BankTransferHistoryType;
}

class BankHistoryDao {
  private database: Knex;

  constructor(database: Knex) {
    this.database = database;
  }

  async fetchById(id: number): Promise<BankHistoryData | null> {
    const bankHistoryRow = await this.database<BankHistoryRow>('bank_history')
      .where({ id: id })
      .first();
    if (!bankHistoryRow) return null;
    return this.mapBankHistoryRowToBankHistoryData(bankHistoryRow);
  }

  async fetchToUserHistory(toUserId: number): Promise<BankHistoryData[]> {
    const bankHistoryRows = await this.database<BankHistoryRow>('bank_history')
      .where({ to_user_id: toUserId })
      .select();
    return bankHistoryRows.map((historyRow) =>
      this.mapBankHistoryRowToBankHistoryData(historyRow)
    );
  }

  async createHistory(historyData: BankHistoryData): Promise<BankHistoryData> {
    const newHistoryRow = await this.database<BankHistoryRow>('bank_history')
      .insert({
        gold_amount: historyData.goldAmount.toString(),
        from_user_id: historyData.fromUserId,
        from_user_account_type: historyData.fromUserAccount,
        to_user_id: historyData.toUserId,
        to_user_account_type: historyData.toUserAccount,
        date_time: historyData.dateTime,
        history_type: historyData.historyType,
      })
      .returning('*');
    return this.mapBankHistoryRowToBankHistoryData(newHistoryRow[0]);
  }

  private mapBankHistoryRowToBankHistoryData(
    bankHistoryRow: BankHistoryRow
  ): BankHistoryData {
    return {
      id: bankHistoryRow.id,
      goldAmount: parseInt(bankHistoryRow.gold_amount),
      fromUserId: bankHistoryRow.from_user_id,
      fromUserAccount: bankHistoryRow.from_user_account_type as BankAccountType,
      toUserId: bankHistoryRow.to_user_id,
      toUserAccount: bankHistoryRow.to_user_account_type as BankAccountType,
      dateTime: bankHistoryRow.date_time,
      historyType: bankHistoryRow.history_type as BankTransferHistoryType,
    };
  }
}

export default BankHistoryDao;
