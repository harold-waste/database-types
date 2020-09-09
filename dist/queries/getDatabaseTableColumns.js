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
      col.table_name "tableName",
      col.column_name "columnName",
      col.is_nullable "isNullable",
      col.data_type "dataType",
      tco.constraint_type "constraintType",
      pgc."constraintDef"
    FROM information_schema.columns col
    left join (
	    select kcu.table_schema,
	       kcu.table_name,
	       kcu.column_name,
	       tco.constraint_type
		from information_schema.table_constraints tco
		join information_schema.key_column_usage kcu 
			 on kcu.constraint_name = tco.constraint_name
			 and kcu.constraint_schema = tco.constraint_schema
			 and kcu.constraint_name = tco.constraint_name
		where kcu.table_schema = ${schema} and (tco.constraint_type = 'PRIMARY KEY' or tco.constraint_type = 'FOREIGN KEY')
    ) as tco on tco.table_name = col.table_name and tco.column_name = col.column_name and tco.table_schema = col.table_schema
    left join (
		select pgc.conname as constraint_name,
		       ccu.table_schema as table_schema,
		       ccu.table_name,
		       ccu.column_name,
		       pg_get_constraintdef(pgc.oid) as "constraintDef"
		from pg_constraint pgc
		join pg_namespace nsp on nsp.oid = pgc.connamespace
		join pg_class  cls on pgc.conrelid = cls.oid
		left join information_schema.constraint_column_usage ccu
          on pgc.conname = ccu.constraint_name
          and nsp.nspname = ccu.constraint_schema
        where pg_get_constraintdef(pgc.oid) like '%ARRAY%' and ccu.table_schema = ${schema}
    ) as pgc on pgc.table_name = col.table_name and pgc.column_name = col.column_name and pgc.table_schema = col.table_schema
    WHERE col.table_schema = ${schema}
  `);
  });

  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
})();
//# sourceMappingURL=getDatabaseTableColumns.js.map