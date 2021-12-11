import { Request, Response } from 'express';
import { UnitType } from '../../../types/typings';
// import { UnitTypes } from '../../constants';

export default {
  async trainingPage(req: Request, res: Response) {

    const unitMapFunction = (unit, idPrefix: string) => {
      return {
        id: `${idPrefix}_${unit.level}`,
        name: unit.name,
        bonus: unit.bonus,
        ownedUnits: req.user.units.find(u => u.type === unit.type && u.level === unit.level)?.quantity || 0,
        cost: new Intl.NumberFormat('en-GB').format(unit.cost),
      };
    };

    return res.render('page/main/training', {
      layout: 'main',
      pageTitle: 'Training',
      sidebarData: req.sidebarData,

      gold: new Intl.NumberFormat('en-GB').format(req.user.gold),
      goldInBank: new Intl.NumberFormat('en-GB').format(req.user.goldInBank),
      citizens: req.user.citizens,

      workerUnits: req.user.availableUnitTypes
        .filter(unit => unit.type === 'WORKER')
        .map(unit => unitMapFunction(unit, 'WORKER')),
      offensiveUnits: req.user.availableUnitTypes
        .filter(unit => unit.type === 'OFFENSE')
        .map(unit => unitMapFunction(unit, 'OFFENSE')),
      defensiveUnits: req.user.availableUnitTypes
        .filter(unit => unit.type === 'DEFENSE')
        .map(unit => unitMapFunction(unit, 'DEFENSE')),
      spyUnits: req.user.availableUnitTypes
        .filter(unit => unit.type === 'SPY')
        .map(unit => unitMapFunction(unit, 'SPY')),
      sentryUnits: req.user.availableUnitTypes
        .filter(unit => unit.type === 'SENTRY')
        .map(unit => unitMapFunction(unit, 'SENTRY')),
    });
  },

  async trainUnitsAction(req: Request, res: Response) {
    const body = req.body;

    const unitsToTrain: { type: string, level: number; cost: number; quantity: number }[] = req.user.availableUnitTypes.map(unit => {
      const quantity = body[`${unit.type}_${unit.level}`];
      if (quantity) {
        return {
          type: unit.type,
          level: unit.level,
          cost: unit.cost,
          quantity: parseInt(quantity),
        };
      }
    }).filter(unit => !!unit);

    req.logger.debug('Units to be trained', unitsToTrain);
    if (unitsToTrain.length === 0) {
      return req.logger.debug('No units to train');
    }

    const totalRequestedUnits = unitsToTrain.reduce((total, unit) => total + unit.quantity, 0);
    if (totalRequestedUnits > req.user.citizens) {
      return req.logger.debug('Not enough citizens to train requested units');
    }

    const totalCost = unitsToTrain.reduce((total, unit) => total + (unit.quantity * unit.cost), 0);
    if (totalCost > req.user.gold) {
      return req.logger.debug('Not enough gold to train requested units');
    }

    await req.user.subtractGold(totalCost);
    req.logger.debug('Subtracted gold for training units', totalCost);

    await req.user.trainNewUnits(
      unitsToTrain.map(
        (unit) => ({
          level: unit.level,
          type: unit.type as UnitType,
          quantity: unit.quantity,
        })
      )
    );
    req.logger.debug('Trained new units', unitsToTrain);
    
    // TODO: RENDER PAGE WITH MESSAGES
    res.redirect('/training');
  }
}