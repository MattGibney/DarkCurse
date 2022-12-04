import { Request, Response } from 'express';
import { UnitType, ItemType, Unit } from '../../../types/typings';
// import { UnitTypes } from '../../constants';

export default {
  async armoryPage(req: Request, res: Response) {
    const unitMapFunction = (unit, idPrefix: string) => {
      return {
        id: `${idPrefix}_${unit.level}`,
        name: unit.name,
        bonus: unit.bonus,
        owneditems:
          req.user.items.find(
            (u) => u.type === unit.type && u.level === unit.level
          )?.quantity || 0,
        cost: new Intl.NumberFormat('en-GB').format(unit.cost),
      };
    };
    const itemMapFunction = (unit, idPrefix: string, itemType: string) => {
      return {
        id: `${itemType}_${idPrefix}_${unit.level}`,
        name: unit.name,
        bonus: unit.bonus,
        owneditems:
          req.user.items.find(
            (u) =>
              u.type === unit.type &&
              u.level === unit.level &&
              u.unitType === unit.usage
          )?.quantity || 0,
        cost: new Intl.NumberFormat('en-GB').format(unit.cost),
        enabled: unit.level <= req.user.fortLevel ? true : false,
        level: req.user.fortLevel,
      };
    };

    console.log(
      req.user.availableItemTypes
        .filter((unit) => unit.usage === 'OFFENSE' && unit.type == 'WEAPON')
        .map((unit) => itemMapFunction(unit, 'OFFENSE', 'WEAPON'))
    );

    return res.render('page/main/armory', {
      layout: 'main',
      pageTitle: 'Armory',
      menu_category: 'structures',
      menu_link: 'armory',
      sidebarData: req.sidebarData,
      userDataFiltered: await req.user.formatUsersStats(req.user),

      units: req.user.unitTotals[0],
      itemTypes: ['WEAPON', 'HELM', 'ARMOR', 'BOOTS', 'BRACERS', 'SHIELD'], //TODO: this is me being lazy
      offensiveWeapons: req.user.availableItemTypes
        .filter((unit) => unit.usage === 'OFFENSE' && unit.type == 'WEAPON')
        .map((unit) => itemMapFunction(unit, 'OFFENSE', 'WEAPON')),
      defensiveWeapons: req.user.availableItemTypes
        .filter((unit) => unit.usage === 'DEFENSE' && unit.type == 'WEAPON')
        .map((unit) => itemMapFunction(unit, 'DEFENSE', 'WEAPON')),
      offensiveHelm: req.user.availableItemTypes
        .filter((unit) => unit.usage === 'OFFENSE' && unit.type == 'HELM')
        .map((unit) => itemMapFunction(unit, 'OFFENSE', 'HELM')),
      defensiveHelm: req.user.availableItemTypes
        .filter((unit) => unit.usage === 'DEFENSE' && unit.type == 'HELM')
        .map((unit) => itemMapFunction(unit, 'DEFENSE', 'HELM')),
      offensiveBoots: req.user.availableItemTypes
        .filter((unit) => unit.usage === 'OFFENSE' && unit.type == 'BOOTS')
        .map((unit) => itemMapFunction(unit, 'OFFENSE', 'BOOTS')),
      defensiveBoots: req.user.availableItemTypes
        .filter((unit) => unit.usage === 'DEFENSE' && unit.type == 'BOOTS')
        .map((unit) => itemMapFunction(unit, 'DEFENSE', 'BOOTS')),
      offensiveBracers: req.user.availableItemTypes
        .filter((unit) => unit.usage === 'OFFENSE' && unit.type == 'BRACERS')
        .map((unit) => itemMapFunction(unit, 'OFFENSE', 'BRACERS')),
      defensiveBracers: req.user.availableItemTypes
        .filter((unit) => unit.usage === 'DEFENSE' && unit.type == 'BRACERS')
        .map((unit) => itemMapFunction(unit, 'DEFENSE', 'BRACERS')),
      offensiveShield: req.user.availableItemTypes
        .filter((unit) => unit.usage === 'OFFENSE' && unit.type == 'SHIELD')
        .map((unit) => itemMapFunction(unit, 'OFFENSE', 'SHIELD')),
      defensiveShield: req.user.availableItemTypes
        .filter((unit) => unit.usage === 'DEFENSE' && unit.type == 'SHIELD')
        .map((unit) => itemMapFunction(unit, 'DEFENSE', 'SHIELD')),
      offensiveArmor: req.user.availableItemTypes
        .filter((unit) => unit.usage === 'OFFENSE' && unit.type == 'ARMOR')
        .map((unit) => itemMapFunction(unit, 'OFFENSE', 'ARMOR')),
      defensiveArmor: req.user.availableItemTypes
        .filter((unit) => unit.usage === 'DEFENSE' && unit.type == 'ARMOR')
        .map((unit) => itemMapFunction(unit, 'DEFENSE', 'ARMOR')),
      spyWeapons: req.user.availableItemTypes
        .filter((unit) => unit.usage === 'SPY' && unit.type == 'WEAPON')
        .map((unit) => itemMapFunction(unit, 'SPY', 'WEAPON')),
      sentryWeapons: req.user.availableItemTypes
        .filter((unit) => unit.usage === 'SENTRY' && unit.type == 'WEAPON')
        .map((unit) => itemMapFunction(unit, 'SENTRY', 'WEAPON')),
      spyHelm: req.user.availableItemTypes
        .filter((unit) => unit.usage === 'SPY' && unit.type == 'HELM')
        .map((unit) => itemMapFunction(unit, 'SPY', 'HELM')),
      sentryHelm: req.user.availableItemTypes
        .filter((unit) => unit.usage === 'SENTRY' && unit.type == 'HELM')
        .map((unit) => itemMapFunction(unit, 'SENTRY', 'HELM')),
      spyBoots: req.user.availableItemTypes
        .filter((unit) => unit.usage === 'SPY' && unit.type == 'BOOTS')
        .map((unit) => itemMapFunction(unit, 'SPY', 'BOOTS')),
      sentryBoots: req.user.availableItemTypes
        .filter((unit) => unit.usage === 'SENTRY' && unit.type == 'BOOTS')
        .map((unit) => itemMapFunction(unit, 'SENTRY', 'BOOTS')),
      spyBracers: req.user.availableItemTypes
        .filter((unit) => unit.usage === 'SPY' && unit.type == 'BRACERS')
        .map((unit) => itemMapFunction(unit, 'SPY', 'BRACERS')),
      sentryBracers: req.user.availableItemTypes
        .filter((unit) => unit.usage === 'SENTRY' && unit.type == 'BRACERS')
        .map((unit) => itemMapFunction(unit, 'SENTRY', 'BRACERS')),
      spyShield: req.user.availableItemTypes
        .filter((unit) => unit.usage === 'SPY' && unit.type == 'SHIELD')
        .map((unit) => itemMapFunction(unit, 'SPY', 'SHIELD')),
      sentryShield: req.user.availableItemTypes
        .filter((unit) => unit.usage === 'SENTRY' && unit.type == 'SHIELD')
        .map((unit) => itemMapFunction(unit, 'SENTRY', 'SHIELD')),
      spyArmor: req.user.availableItemTypes
        .filter((unit) => unit.usage === 'SPY' && unit.type == 'ARMOR')
        .map((unit) => itemMapFunction(unit, 'SPY', 'ARMOR')),
      sentryArmor: req.user.availableItemTypes
        .filter((unit) => unit.usage === 'SENTRY' && unit.type == 'ARMOR')
        .map((unit) => itemMapFunction(unit, 'SENTRY', 'ARMOR')),
      offensiveUnits: req.user.units
        .filter((unit) => unit.type === 'SPY')
        .map((unit) => unitMapFunction(unit, 'SPY'))
        .reduce((acc, unit) => acc + unit.owneditems, 0),
      defensiveUnits: req.user.units
        .filter((unit) => unit.type === 'DEFENSE')
        .map((unit) => unitMapFunction(unit, 'DEFENSE'))
        .reduce((acc, unit) => acc + unit.owneditems, 0),
      spyUnits: req.user.units
        .filter((unit) => unit.type === 'SPY')
        .map((unit) => unitMapFunction(unit, 'SPY'))
        .reduce((acc, unit) => acc + unit.owneditems, 0),
      sentryUnits: req.user.units
        .filter((unit) => unit.type === 'SENTRY')
        .map((unit) => unitMapFunction(unit, 'SENTRY'))
        .reduce((acc, unit) => acc + unit.owneditems, 0),
    });
  },

  async equipItemAction(req: Request, res: Response) {
    const body = req.body;
    const unitsToTrain: {
      type: string;
      unitType: string;
      level: number;
      cost: number;
      quantity: number;
    }[] = req.user.availableItemTypes
      .map((unit) => {
        const quantity = body[`${unit.type}_${unit.usage}_${unit.level}`];
        if (quantity > 0) {
          return {
            type: unit.type,
            unitType: unit.usage,
            level: unit.level,
            cost: unit.cost,
            quantity: parseInt(quantity),
          };
        }
      })
      .filter((unit) => !!unit);

    const itemMapFunction = (unit, idPrefix: string, itemType: string) => {
      return {
        id: `${itemType}_${idPrefix}_${unit.level}`,
        name: unit.name,
        bonus: unit.bonus,
        owneditems:
          req.user.items.find(
            (u) =>
              u.type === unit.type &&
              u.level === unit.level &&
              u.unitType === unit.usage
          )?.quantity || 0,
        cost: new Intl.NumberFormat('en-GB').format(unit.cost),
        enabled: unit.level <= req.user.fortLevel ? true : false,
        level: req.user.fortLevel,
      };
    };
    req.logger.debug('Items to be equipped', unitsToTrain);
    if (unitsToTrain.length === 0) {
      req.logger.debug('No items to equip');
      return res.json({
        error: 'No items to equip',
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

    await req.user.equipNewItems(
      unitsToTrain.map((unit) => ({
        level: unit.level,
        type: unit.type as ItemType,
        quantity: unit.quantity,
        unitType: unit.unitType as UnitType,
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
        offensiveWeapons: req.user.availableItemTypes
          .filter((unit) => unit.usage === 'OFFENSE' && unit.type == 'WEAPON')
          .map((unit) => itemMapFunction(unit, 'OFFENSE', 'WEAPON')),
        defensiveWeapons: req.user.availableItemTypes
          .filter((unit) => unit.usage === 'DEFENSE' && unit.type == 'WEAPON')
          .map((unit) => itemMapFunction(unit, 'DEFENSE', 'WEAPON')),
        offensiveHelm: req.user.availableItemTypes
          .filter((unit) => unit.usage === 'OFFENSE' && unit.type == 'HELM')
          .map((unit) => itemMapFunction(unit, 'OFFENSE', 'HELM')),
        defensiveHelm: req.user.availableItemTypes
          .filter((unit) => unit.usage === 'DEFENSE' && unit.type == 'HELM')
          .map((unit) => itemMapFunction(unit, 'DEFENSE', 'HELM')),
        offensiveBoots: req.user.availableItemTypes
          .filter((unit) => unit.usage === 'OFFENSE' && unit.type == 'BOOTS')
          .map((unit) => itemMapFunction(unit, 'OFFENSE', 'BOOTS')),
        defensiveBoots: req.user.availableItemTypes
          .filter((unit) => unit.usage === 'DEFENSE' && unit.type == 'BOOTS')
          .map((unit) => itemMapFunction(unit, 'DEFENSE', 'BOOTS')),
        offensiveBracers: req.user.availableItemTypes
          .filter((unit) => unit.usage === 'OFFENSE' && unit.type == 'BRACERS')
          .map((unit) => itemMapFunction(unit, 'OFFENSE', 'BRACERS')),
        defensiveBracers: req.user.availableItemTypes
          .filter((unit) => unit.usage === 'DEFENSE' && unit.type == 'BRACERS')
          .map((unit) => itemMapFunction(unit, 'DEFENSE', 'BRACERS')),
        offensiveShield: req.user.availableItemTypes
          .filter((unit) => unit.usage === 'OFFENSE' && unit.type == 'SHIELD')
          .map((unit) => itemMapFunction(unit, 'OFFENSE', 'SHIELD')),
        defensiveShield: req.user.availableItemTypes
          .filter((unit) => unit.usage === 'DEFENSE' && unit.type == 'SHIELD')
          .map((unit) => itemMapFunction(unit, 'DEFENSE', 'SHIELD')),
        offensiveArmor: req.user.availableItemTypes
          .filter((unit) => unit.usage === 'OFFENSE' && unit.type == 'ARMOR')
          .map((unit) => itemMapFunction(unit, 'OFFENSE', 'ARMOR')),
        defensiveArmor: req.user.availableItemTypes
          .filter((unit) => unit.usage === 'DEFENSE' && unit.type == 'ARMOR')
          .map((unit) => itemMapFunction(unit, 'DEFENSE', 'ARMOR')),
        spyWeapons: req.user.availableItemTypes
          .filter((unit) => unit.usage === 'SPY' && unit.type == 'WEAPON')
          .map((unit) => itemMapFunction(unit, 'SPY', 'WEAPON')),
        sentryWeapons: req.user.availableItemTypes
          .filter((unit) => unit.usage === 'SENTRY' && unit.type == 'WEAPON')
          .map((unit) => itemMapFunction(unit, 'SENTRY', 'WEAPON')),
        spyHelm: req.user.availableItemTypes
          .filter((unit) => unit.usage === 'SPY' && unit.type == 'HELM')
          .map((unit) => itemMapFunction(unit, 'SPY', 'HELM')),
        sentryHelm: req.user.availableItemTypes
          .filter((unit) => unit.usage === 'SENTRY' && unit.type == 'HELM')
          .map((unit) => itemMapFunction(unit, 'SENTRY', 'HELM')),
        spyBoots: req.user.availableItemTypes
          .filter((unit) => unit.usage === 'SPY' && unit.type == 'BOOTS')
          .map((unit) => itemMapFunction(unit, 'SPY', 'BOOTS')),
        sentryBoots: req.user.availableItemTypes
          .filter((unit) => unit.usage === 'SENTRY' && unit.type == 'BOOTS')
          .map((unit) => itemMapFunction(unit, 'SENTRY', 'BOOTS')),
        spyBracers: req.user.availableItemTypes
          .filter((unit) => unit.usage === 'SPY' && unit.type == 'BRACERS')
          .map((unit) => itemMapFunction(unit, 'SPY', 'BRACERS')),
        sentryBracers: req.user.availableItemTypes
          .filter((unit) => unit.usage === 'SENTRY' && unit.type == 'BRACERS')
          .map((unit) => itemMapFunction(unit, 'SENTRY', 'BRACERS')),
        spyShield: req.user.availableItemTypes
          .filter((unit) => unit.usage === 'SPY' && unit.type == 'SHIELD')
          .map((unit) => itemMapFunction(unit, 'SPY', 'SHIELD')),
        sentryShield: req.user.availableItemTypes
          .filter((unit) => unit.usage === 'SENTRY' && unit.type == 'SHIELD')
          .map((unit) => itemMapFunction(unit, 'SENTRY', 'SHIELD')),
        spyArmor: req.user.availableItemTypes
          .filter((unit) => unit.usage === 'SPY' && unit.type == 'ARMOR')
          .map((unit) => itemMapFunction(unit, 'SPY', 'ARMOR')),
        sentryArmor: req.user.availableItemTypes
          .filter((unit) => unit.usage === 'SENTRY' && unit.type == 'ARMOR')
          .map((unit) => itemMapFunction(unit, 'SENTRY', 'ARMOR')),
      },
    });
  },

  async unequipItemAction(req: Request, res: Response) {
    const body = req.body;
    const unitsToTrain: {
      type: string;
      unitType: string;
      level: number;
      cost: number;
      quantity: number;
    }[] = req.user.availableItemTypes
      .map((unit) => {
        const quantity = body[`${unit.type}_${unit.usage}_${unit.level}`];
        if (quantity > 0) {
          return {
            type: unit.type,
            unitType: unit.usage,
            level: unit.level,
            cost: unit.cost,
            quantity: parseInt(quantity),
          };
        }
      })
      .filter((unit) => !!unit);

    req.logger.debug('Items to be equipped', unitsToTrain);
    if (unitsToTrain.length === 0) {
      req.logger.debug('No items to equip');
      return res.json({
        error: 'No items to equip',
      });
    }

    const itemMapFunction = (unit, idPrefix: string, itemType: string) => {
      return {
        id: `${itemType}_${idPrefix}_${unit.level}`,
        name: unit.name,
        bonus: unit.bonus,
        owneditems:
          req.user.items.find(
            (u) =>
              u.type === unit.type &&
              u.level === unit.level &&
              u.unitType === unit.usage
          )?.quantity || 0,
        cost: new Intl.NumberFormat('en-GB').format(unit.cost),
        enabled: unit.level <= req.user.fortLevel ? true : false,
        level: req.user.fortLevel,
      };
    };

    const totalCost = unitsToTrain.reduce(
      (total, unit) => total + unit.quantity * unit.cost,
      0
    );
    if (totalCost > req.user.gold) {
      req.logger.debug('Not enough gold to equip requested items');
      return res.json({
        error: 'Not enough gold to equip requested items',
      });
    }
    await req.user.subtractGold(totalCost);
    req.logger.debug('Subtracted gold for equipping items', totalCost);

    await req.user.unequipNewItems(
      unitsToTrain.map((unit) => ({
        level: unit.level,
        type: unit.type as ItemType,
        quantity: unit.quantity,
        unitType: unit.unitType as UnitType,
      }))
    );
    req.logger.debug('Unequiped new items', unitsToTrain);

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
      success: 'Unequiped new items!',
      stats: {
        gold: new Intl.NumberFormat('en-GB').format(req.user.gold),
        goldInBank: new Intl.NumberFormat('en-GB').format(req.user.goldInBank),
        citizens: req.user.citizens,
        offensiveWeapons: req.user.availableItemTypes
          .filter((unit) => unit.usage === 'OFFENSE' && unit.type == 'WEAPON')
          .map((unit) => itemMapFunction(unit, 'OFFENSE', 'WEAPON')),
        defensiveWeapons: req.user.availableItemTypes
          .filter((unit) => unit.usage === 'DEFENSE' && unit.type == 'WEAPON')
          .map((unit) => itemMapFunction(unit, 'DEFENSE', 'WEAPON')),
        offensiveHelm: req.user.availableItemTypes
          .filter((unit) => unit.usage === 'OFFENSE' && unit.type == 'HELM')
          .map((unit) => itemMapFunction(unit, 'OFFENSE', 'HELM')),
        defensiveHelm: req.user.availableItemTypes
          .filter((unit) => unit.usage === 'DEFENSE' && unit.type == 'HELM')
          .map((unit) => itemMapFunction(unit, 'DEFENSE', 'HELM')),
        offensiveBoots: req.user.availableItemTypes
          .filter((unit) => unit.usage === 'OFFENSE' && unit.type == 'BOOTS')
          .map((unit) => itemMapFunction(unit, 'OFFENSE', 'BOOTS')),
        defensiveBoots: req.user.availableItemTypes
          .filter((unit) => unit.usage === 'DEFENSE' && unit.type == 'BOOTS')
          .map((unit) => itemMapFunction(unit, 'DEFENSE', 'BOOTS')),
        offensiveBracers: req.user.availableItemTypes
          .filter((unit) => unit.usage === 'OFFENSE' && unit.type == 'BRACERS')
          .map((unit) => itemMapFunction(unit, 'OFFENSE', 'BRACERS')),
        defensiveBracers: req.user.availableItemTypes
          .filter((unit) => unit.usage === 'DEFENSE' && unit.type == 'BRACERS')
          .map((unit) => itemMapFunction(unit, 'DEFENSE', 'BRACERS')),
        offensiveShield: req.user.availableItemTypes
          .filter((unit) => unit.usage === 'OFFENSE' && unit.type == 'SHIELD')
          .map((unit) => itemMapFunction(unit, 'OFFENSE', 'SHIELD')),
        defensiveShield: req.user.availableItemTypes
          .filter((unit) => unit.usage === 'DEFENSE' && unit.type == 'SHIELD')
          .map((unit) => itemMapFunction(unit, 'DEFENSE', 'SHIELD')),
        offensiveArmor: req.user.availableItemTypes
          .filter((unit) => unit.usage === 'OFFENSE' && unit.type == 'ARMOR')
          .map((unit) => itemMapFunction(unit, 'OFFENSE', 'ARMOR')),
        defensiveArmor: req.user.availableItemTypes
          .filter((unit) => unit.usage === 'DEFENSE' && unit.type == 'ARMOR')
          .map((unit) => itemMapFunction(unit, 'DEFENSE', 'ARMOR')),
        spyWeapons: req.user.availableItemTypes
          .filter((unit) => unit.usage === 'SPY' && unit.type == 'WEAPON')
          .map((unit) => itemMapFunction(unit, 'SPY', 'WEAPON')),
        sentryWeapons: req.user.availableItemTypes
          .filter((unit) => unit.usage === 'SENTRY' && unit.type == 'WEAPON')
          .map((unit) => itemMapFunction(unit, 'SENTRY', 'WEAPON')),
        spyHelm: req.user.availableItemTypes
          .filter((unit) => unit.usage === 'SPY' && unit.type == 'HELM')
          .map((unit) => itemMapFunction(unit, 'SPY', 'HELM')),
        sentryHelm: req.user.availableItemTypes
          .filter((unit) => unit.usage === 'SENTRY' && unit.type == 'HELM')
          .map((unit) => itemMapFunction(unit, 'SENTRY', 'HELM')),
        spyBoots: req.user.availableItemTypes
          .filter((unit) => unit.usage === 'SPY' && unit.type == 'BOOTS')
          .map((unit) => itemMapFunction(unit, 'SPY', 'BOOTS')),
        sentryBoots: req.user.availableItemTypes
          .filter((unit) => unit.usage === 'SENTRY' && unit.type == 'BOOTS')
          .map((unit) => itemMapFunction(unit, 'SENTRY', 'BOOTS')),
        spyBracers: req.user.availableItemTypes
          .filter((unit) => unit.usage === 'SPY' && unit.type == 'BRACERS')
          .map((unit) => itemMapFunction(unit, 'SPY', 'BRACERS')),
        sentryBracers: req.user.availableItemTypes
          .filter((unit) => unit.usage === 'SENTRY' && unit.type == 'BRACERS')
          .map((unit) => itemMapFunction(unit, 'SENTRY', 'BRACERS')),
        spyShield: req.user.availableItemTypes
          .filter((unit) => unit.usage === 'SPY' && unit.type == 'SHIELD')
          .map((unit) => itemMapFunction(unit, 'SPY', 'SHIELD')),
        sentryShield: req.user.availableItemTypes
          .filter((unit) => unit.usage === 'SENTRY' && unit.type == 'SHIELD')
          .map((unit) => itemMapFunction(unit, 'SENTRY', 'SHIELD')),
        spyArmor: req.user.availableItemTypes
          .filter((unit) => unit.usage === 'SPY' && unit.type == 'ARMOR')
          .map((unit) => itemMapFunction(unit, 'SPY', 'ARMOR')),
        sentryArmor: req.user.availableItemTypes
          .filter((unit) => unit.usage === 'SENTRY' && unit.type == 'ARMOR')
          .map((unit) => itemMapFunction(unit, 'SENTRY', 'ARMOR')),
      },
    });
  },
};
