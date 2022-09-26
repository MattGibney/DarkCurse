import { Request, Response } from 'express';
import {
  Fortification,
  OffensiveUpgradeType,
  SentryUpgradeType,
  SpyUpgradeType,
  UnitType,
} from '../../../types/typings';
import { Fortifications, SpyUpgrades } from '../../constants';
// import { UnitTypes } from '../../constants';

export default {
  async battleUpgrades(req: Request, res: Response) {
    const defenseUpgradeMapFunction = (
      unit: Fortification,
      idPrefix: string
    ) => {
      return {
        id: `${idPrefix}_${unit.level}`,
        name: unit.name,
        level: unit.level,
        levelRequirement: unit.levelRequirement,
        levelRequirementName: Fortifications.filter((fort) => {
          return fort.level == unit.levelRequirement;
        })[0],
        hitpoints: unit.hitpoints,
        costPerRepairPoint: unit.costPerRepairPoint,
        goldPerTurn: unit.goldPerTurn,
        defenseBonusPercentage: unit.defenseBonusPercentage,
        cost: new Intl.NumberFormat('en-GB').format(unit.cost),
        enabled: unit.level <= req.user.fortLevel ? true : false,
      };
    };

    const offenseUpgradeMapFunction = (
      unit: OffensiveUpgradeType,
      idPrefix: string
    ) => {
      return {
        id: `${idPrefix}_${unit.name}`,
        name: unit.name,
        levelRequirement: unit.fortLevelRequirement,
        levelRequirementName: Fortifications.filter((fort) => {
          return fort.level == unit.fortLevelRequirement;
        })[0],
        offenseBonusPercentage: unit.offenseBonusPercentage,
        cost: new Intl.NumberFormat('en-GB').format(unit.cost),
        enabled: unit.fortLevelRequirement <= req.user.fortLevel ? true : false,
      };
    };

    const spyoffenseUpgradeMapFunction = (
      unit: SpyUpgradeType,
      idPrefix: string
    ) => {
      return {
        id: `${idPrefix}_${unit.name}`,
        name: unit.name,
        levelRequirement: unit.fortLevelRequirement,
        levelRequirementName: Fortifications.filter((fort) => {
          return fort.level == unit.fortLevelRequirement;
        })[0],
        offenseBonusPercentage: unit.offenseBonusPercentage,
        maxInfiltrations: unit.maxInfiltrations,
        maxAssassinations: unit.maxAssassinations,
        cost: new Intl.NumberFormat('en-GB').format(unit.cost),
        enabled: unit.fortLevelRequirement <= req.user.fortLevel ? true : false,
      };
    };

    const spydefenseUpgradeMapFunction = (
      unit: SentryUpgradeType,
      idPrefix: string
    ) => {
      return {
        id: `${idPrefix}_${unit.name}`,
        name: unit.name,
        levelRequirement: unit.fortLevelRequirement,
        defenseBonusPercentage: unit.defenseBonusPercentage,
        cost: new Intl.NumberFormat('en-GB').format(unit.cost),
        enabled: unit.fortLevelRequirement <= req.user.fortLevel ? true : false,
      };
    };

    return res.render('page/main/battle-upgrades', {
      layout: 'main',
      pageTitle: 'Battle Upgrades',
      sidebarData: req.sidebarData,
      menu_category: 'battle',
      menu_link: 'upgrades',

      gold: new Intl.NumberFormat('en-GB').format(req.user.gold),
      goldInBank: new Intl.NumberFormat('en-GB').format(req.user.goldInBank),
      citizens: req.user.citizens,

      defensiveUpgrade: req.user.availableDefenseBattleUpgrades.map((unit) =>
        defenseUpgradeMapFunction(unit, 'DEFENSE')
      ),
      offensiveUpgrade: req.user.availableOffenseBattleUpgrades.map((unit) =>
        offenseUpgradeMapFunction(unit, 'DEFENSE')
      ),
      spyUpgrade: req.user.availableSpyBattleUpgrades.map((unit) =>
        spyoffenseUpgradeMapFunction(unit, 'DEFENSE')
      ),
      sentryUpgrade: req.user.availableSentryBattleUpgrades.map((unit) =>
        spydefenseUpgradeMapFunction(unit, 'DEFENSE')
      ),
    });
  },

  async trainUnitsAction(req: Request, res: Response) {
    const body = req.body;

    const unitsToTrain: {
      type: string;
      level: number;
      cost: number;
      quantity: number;
    }[] = req.user.availableUnitTypes
      .map((unit) => {
        const quantity = body[`${unit.type}_${unit.level}`];
        if (quantity) {
          return {
            type: unit.type,
            level: unit.level,
            cost: unit.cost,
            quantity: parseInt(quantity),
          };
        }
      })
      .filter((unit) => !!unit);

    req.logger.debug('Units to be trained', unitsToTrain);
    if (unitsToTrain.length === 0) {
      req.logger.debug('No units to train');
      return res.json({
        error: 'No units to train',
      });
    }

    const totalRequestedUnits = unitsToTrain.reduce(
      (total, unit) => total + unit.quantity,
      0
    );
    if (totalRequestedUnits > req.user.citizens) {
      req.logger.debug('Not enough citizens to train requested units');
      return res.json({
        error: 'Not enough citizens to train the requested units',
      });
    }

    const totalCost = unitsToTrain.reduce(
      (total, unit) => total + unit.quantity * unit.cost,
      0
    );
    if (totalCost > req.user.gold) {
      req.logger.debug('Not enough gold to train requested units');
      return res.json({
        error: 'Not enough gold to train requested units',
      });
    }

    await req.user.subtractGold(totalCost);
    req.logger.debug('Subtracted gold for training units', totalCost);

    await req.user.trainNewUnits(
      unitsToTrain.map((unit) => ({
        level: unit.level,
        type: unit.type as UnitType,
        quantity: unit.quantity,
      }))
    );
    req.logger.debug('Trained new units', unitsToTrain);

    const unitMapFunction = (unit, idPrefix: string) => {
      return {
        id: `${idPrefix}_${unit.level}`,
        name: unit.name,
        bonus: unit.bonus,
        ownedUnits:
          req.user.units.find(
            (u) => u.type === unit.type && u.level === unit.level
          )?.quantity || 0,
        cost: new Intl.NumberFormat('en-GB').format(unit.cost),
      };
    };

    return res.json({
      success: 'Trained new units!',
      stats: {
        gold: new Intl.NumberFormat('en-GB').format(req.user.gold),
        goldInBank: new Intl.NumberFormat('en-GB').format(req.user.goldInBank),
        citizens: req.user.citizens,
        workerUnits: req.user.availableUnitTypes
          .filter((unit) => unit.type === 'WORKER')
          .map((unit) => unitMapFunction(unit, 'WORKER')),
        offensiveUnits: req.user.availableUnitTypes
          .filter((unit) => unit.type === 'OFFENSE')
          .map((unit) => unitMapFunction(unit, 'OFFENSE')),
        defensiveUnits: req.user.availableUnitTypes
          .filter((unit) => unit.type === 'DEFENSE')
          .map((unit) => unitMapFunction(unit, 'DEFENSE')),
        spyUnits: req.user.availableUnitTypes
          .filter((unit) => unit.type === 'SPY')
          .map((unit) => unitMapFunction(unit, 'SPY')),
        sentryUnits: req.user.availableUnitTypes
          .filter((unit) => unit.type === 'SENTRY')
          .map((unit) => unitMapFunction(unit, 'SENTRY')),
      },
    });
  },
};
