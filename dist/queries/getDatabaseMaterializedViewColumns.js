'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mightyql = require('mightyql');

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

exports.default = (() => {
  var _ref = _asyncToGenerator(function* (connection) {
    return connection.any(_mightyql.sql`
    SELECT
      mv.relname AS "tableName",
      atr.attname AS "columnName",
      pg_catalog.format_type (atr.atttypid, NULL) "dataType",
      (case when atr.attnotnull then 'YES' else 'NO' end) "isNullable"
    FROM
      pg_class mv
      JOIN pg_namespace ns ON mv.relnamespace = ns.oid
      JOIN pg_attribute atr ON atr.attrelid = mv.oid
      AND atr.attnum > 0
      AND NOT atr.attisdropped
    WHERE
      ns.nspname = 'public' AND
      mv.relkind = 'm'
  `);
  });

  return function (_x) {
    return _ref.apply(this, arguments);
  };
})();
//# sourceMappingURL=getDatabaseMaterializedViewColumns.js.map