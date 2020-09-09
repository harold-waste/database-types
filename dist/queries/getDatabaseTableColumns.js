'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mightyql = require('mightyql');

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

exports.default = (() => {
  var _ref = _asyncToGenerator(function* (connection, schema) {
    return connection.any(_mightyql.sql`
    SELECT
      table_name "tableName",
      column_name "columnName",
      is_nullable "isNullable",
      data_type "dataType"
    FROM information_schema.columns
    WHERE table_schema = ${schema}
  `);
  });

  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
})();
//# sourceMappingURL=getDatabaseTableColumns.js.map