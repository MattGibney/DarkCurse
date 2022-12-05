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
CREATE TABLE messages (
  "id" integer GENERATED ALWAYS AS IDENTITY,
  "subject" text not null,
  "body" text not null,
  "from_user_id" integer NOT NULL,
  "to_user_id" integer NOT NULL,
  "date_time" timestamptz NOT NULL DEFAULT NOW(),
  "created_date" timestamptz NOT NULL DEFAULT NOW(),
  "updated_date" timestamptz NOT NULL DEFAULT NOW(),
  "unread" integer default "1",
  PRIMARY KEY ("id"),
  FOREIGN KEY ("from_user_id") REFERENCES users("id"),
  FOREIGN KEY ("to_user_id") REFERENCES users("id")
);

CREATE TRIGGER update_messages_updated_date
BEFORE
UPDATE ON messages
FOR EACH ROW EXECUTE PROCEDURE auto_update();

`;
  return db.runSql(query);
};

exports.down = function (db) {
  const query = `DROP TABLE messages;`;
  return db.runSql(query);
};

exports._meta = {
  version: 1,
};
