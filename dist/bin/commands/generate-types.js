'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.handler = exports.builder = exports.desc = exports.command = undefined;

var _lodash = require('lodash');

var _mightyql = require('mightyql');

var _queries = require('../../queries');

var _utilities = require('../../utilities');

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

/* eslint-disable no-new-func */

const command = exports.command = 'generate-types';
const desc = exports.desc = 'Generate types for a Postgres database.';

const builder = exports.builder = yargs => {
  yargs.options({
    'column-filter': {
      description: 'Function used to filter columns. Function is constructed using `new Function`. Function receives table name as the first parameter and column name as the second parameter (parameter names are "tableName" and "columnName").',
      type: 'string'
    },
    'database-connection-uri': {
      demand: true
    },
    dialect: {
      choices: ['flow'],
      demand: true
    },
    schema: {
      demand: true
    },
    'include-materialized-views': {
      default: true,
      type: 'boolean'
    },
    'property-name-formatter': {
      default: null,
      description: 'Function used to format property name. Function is constructed using `new Function`. Function receives column name as the first parameter (parameter name is "columnName"). The default behaviour is to (lower) camelCase the column name.',
      type: 'string'
    },
    'type-name-formatter': {
      default: null,
      description: 'Function used to format type name. Function is constructed using `new Function`. Function receives table name as the first parameter (parameter name is "tableName"). The default behaviour is to (upper) CamelCase the table name and suffix it with "RecordType".',
      type: 'string'
    }
  });
};

const handler = exports.handler = (() => {
  var _ref = _asyncToGenerator(function* (argv) {
    const defaultFormatTypeName = function defaultFormatTypeName(tableName) {
      return (0, _lodash.upperFirst)((0, _lodash.camelCase)(tableName)) + 'RecordType';
    };

    const defaultFormatPropertyName = function defaultFormatPropertyName(columnName) {
      return (0, _lodash.camelCase)(columnName);
    };

    // eslint-disable-next-line no-extra-parens
    const filterColumns = argv.columnFilter ? new Function('tableName', 'columnName', argv.columnFilter) : null;

    // eslint-disable-next-line no-extra-parens
    const formatTypeName = argv.typeNameFormatter ? new Function('columnName', argv.typeNameFormatter) : defaultFormatTypeName;
    // eslint-disable-next-line no-extra-parens
    const formatPropertyName = argv.propertyNameFormatter ? new Function('tableName', argv.propertyNameFormatter) : defaultFormatPropertyName;

    const createProperties = function createProperties(columns) {
      let filteredColumns = columns;

      if (filterColumns) {
        filteredColumns = filteredColumns.filter(function (column) {
          // $FlowFixMe
          return filterColumns(column.tableName, column.columnName);
        });
      }

      return filteredColumns.map(function (column) {
        return {
          name: formatPropertyName(column.columnName),
          type: (0, _utilities.mapFlowType)(column.databaseType) + (column.nullable ? ' | null' : ''),
          typeName: formatTypeName(column.tableName)
        };
      });
    };

    const connection = yield (0, _mightyql.createConnection)(argv.databaseConnectionUri);

    let unnormalizedColumns;

    unnormalizedColumns = yield (0, _queries.getDatabaseTableColumns)(connection, argv.schema);

    if (argv.includeMaterializedViews) {
      unnormalizedColumns = unnormalizedColumns.concat((yield (0, _queries.getDatabaseMaterializedViewColumns)(connection)));
    }

    const normalizedColumns = (0, _utilities.normalizeColumns)(unnormalizedColumns);

    const properties = createProperties(normalizedColumns);

    // eslint-disable-next-line no-console
    console.log((0, _utilities.generateFlowTypeDocument)(properties));

    yield connection.end();
  });

  return function handler(_x) {
    return _ref.apply(this, arguments);
  };
})();
//# sourceMappingURL=generate-types.js.map