import { Request, Response } from 'express';
import { UnitTypes } from '../../constants';

export default {
  async trainingPage(req: Request, res: Response) {

    const unitMapFunction = (unit, idPrefix: string) => {
      return {
        id: `${idPrefix}${unit.level}`,
        name: unit.name,
        bonus: unit.bonus,
        ownedUnits: req.user.units.find(u => u.unitType === unit.type)?.quantity || 0,
        cost: new Intl.NumberFormat('en-GB').format(unit.cost),
      };
    };

    return res.render('page/main/training', {
      layout: 'main',
      pageTitle: 'Training',

      gold: new Intl.NumberFormat('en-GB').format(req.user.gold),
      goldInBank: new Intl.NumberFormat('en-GB').format(req.user.goldInBank),
      citizens: req.user.citizens,
      level: req.user.level,
      experience: new Intl.NumberFormat('en-GB').format(req.user.experience),
      xpToNextLevel: new Intl.NumberFormat('en-GB').format(req.user.xpToNextLevel),
      attackTurns: req.user.attackTurns,

      workerUnits: UnitTypes
        .filter(unit => unit.type === 'WORKER')
        .map(unit => unitMapFunction(unit, 'WORKER')),
      offensiveUnits: UnitTypes
        .filter(unit => unit.type === 'OFFENSE')
        .map(unit => unitMapFunction(unit, 'OFFENSE')),
      defensiveUnits: UnitTypes
        .filter(unit => unit.type === 'DEFENSE')
        .map(unit => unitMapFunction(unit, 'DEFENSE')),
      spyUnits: UnitTypes
        .filter(unit => unit.type === 'SPY')
        .map(unit => unitMapFunction(unit, 'SPY')),
      sentryUnits: UnitTypes
        .filter(unit => unit.type === 'SENTRY')
        .map(unit => unitMapFunction(unit, 'SENTRY')),
    });
  }
}