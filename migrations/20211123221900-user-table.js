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
CREATE TABLE users (
  id integer GENERATED ALWAYS AS IDENTITY,
  display_name text NOT NULL,
  email text NOT NULL,
  password_hash text NOT NULL,
  race text NOT NULL,
  class text NOT NULL,
  units json NOT NULL DEFAULT '[{"unitType":"CITIZEN","quantity":50}]',
  experience bigint NOT NULL DEFAULT '0',
  gold bigint NOT NULL DEFAULT '1000',
  gold_in_bank bigint NOT NULL DEFAULT '0',
  fort_level integer NOT NULL DEFAULT '1',
  fort_hitpoints integer NOT NULL DEFAULT '100',
  attack_turns bigint NOT NULL DEFAULT '100',
  created_date timestamptz NOT NULL DEFAULT NOW(),
  updated_date timestamptz NOT NULL DEFAULT NOW(),
  last_active timestamptz NOT NULL DEFAULT NOW(),
  PRIMARY KEY (id),
  UNIQUE (display_name),
  UNIQUE (email)
);

CREATE OR REPLACE FUNCTION auto_update() RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_date = NOW();
  RETURN NEW;
END;
$$ LANGUAGE PLPGSQL;

CREATE TRIGGER update_users_updated_date
BEFORE
UPDATE ON users
FOR EACH ROW EXECUTE PROCEDURE auto_update();
`;
  return db.runSql(query);
};

exports.down = function (db) {
  const query = `
DROP TABLE users;
DROP FUNCTION auto_update();
DROP TRIGGER update_users_updated_date ON users;
`;
  return db.runSql(query);
};

exports._meta = {
  version: 1,
};
