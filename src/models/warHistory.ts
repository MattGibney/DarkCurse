class WarHistoryModel {
  public id: number;
  public attackingUserId: number;
  public targetUserId: number;
  public victorId: number;
  public turnsUsed: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

  public attackerUnits: number;
  public attackerDamage: number;
  public targetUnits: number;
  public targetDamage: number;

  public goldPillaged: number;
  public experienceGained: number;

  public attackerLosses: number;
  public targetLosses: number;

  public attackerCasualties: number;
  public targetCasualties: number;
}

export default WarHistoryModel;
