'use strict';

var dbm;
var type;
var seed;

/*
 * We receive the dbmigrate dependency from dbmigrate initially.
 * This enables us to not have to rely on NODE_PATH.
 */
exports.setup = function (options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function (db) {
  const query = `
ALTER TABLE users ADD battle_upgrades json NOT NULL DEFAULT '[{"type":"Offense", "level": 1, "quantity":0}, {"type":"Spy", "level": 1, "quantity":0}, {"type":"Sentry", "level":1, "quantity":0}]';
`;
  return db.runSql(query);
};

exports.down = function (db) {
  const query = `
ALTER TABLE users DROP COLUMN battle_upgrades;
`;
  return db.runSql(query);
};

exports._meta = {
  version: 1,
};
