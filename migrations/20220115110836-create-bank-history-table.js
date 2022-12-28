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
CREATE TABLE bank_history (
  "id" integer GENERATED ALWAYS AS IDENTITY,
  "gold_amount" integer NOT NULL,
  "from_user_id" integer NOT NULL,
  "from_user_account_type" text NOT NULL,
  "to_user_id" integer NOT NULL,
  "to_user_account_type" text NOT NULL,
  "date_time" timestamptz NOT NULL,
  "history_type" text NOT NULL,
  "created_date" timestamptz NOT NULL DEFAULT NOW(),
  "updated_date" timestamptz NOT NULL DEFAULT NOW(),
  PRIMARY KEY ("id"),
  FOREIGN KEY ("from_user_id") REFERENCES users("id"),
  FOREIGN KEY ("to_user_id") REFERENCES users("id")
);

CREATE TRIGGER update_bank_history_updated_date
BEFORE
UPDATE ON bank_history
FOR EACH ROW EXECUTE PROCEDURE auto_update();

CREATE TABLE public.attack_log (
	id int4 NOT NULL GENERATED ALWAYS AS IDENTITY,
	attacker_id int4 NOT NULL,
	defender_id int4 NOT NULL,
	"timestamp" timestamptz NULL DEFAULT now(),
	winner int4 NOT NULL,
	stats json NOT NULL
);

CREATE TRIGGER update_attack_log_updated_date
BEFORE
UPDATE ON attack_log
FOR EACH ROW EXECUTE PROCEDURE auto_update();`;
  return db.runSql(query);
};

exports.down = function (db) {
  const query = `DROP TABLE bank_history;DROP TABLE attack_log;`;
  return db.runSql(query);
};

exports._meta = {
  version: 1,
};
