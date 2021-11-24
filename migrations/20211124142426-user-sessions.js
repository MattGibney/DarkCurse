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
CREATE TABLE user_sessions (
  id integer GENERATED ALWAYS AS IDENTITY,
  external_id text NOT NULL,
  user_id integer NOT NULL,
  created_date timestamptz NOT NULL DEFAULT NOW(),
  updated_date timestamptz NOT NULL DEFAULT NOW(),
  PRIMARY KEY (id),
  UNIQUE (external_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TRIGGER update_user_sessions_updated_date
BEFORE
UPDATE ON user_sessions
FOR EACH ROW EXECUTE PROCEDURE auto_update();
`;
  return db.runSql(query);
};

exports.down = function (db) {
  const query = `
DROP TABLE user_sessions;
DROP TRIGGER update_user_sessions_updated_date ON user_sessions;
`;
  return db.runSql(query);
};

exports._meta = {
  version: 1,
};
