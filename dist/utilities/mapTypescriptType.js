'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _factories = require('../factories');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const debug = (0, _factories.createDebug)('mapTypescriptType');

exports.default = column => {
  const constraintDef = column.constraintDef,
        columnName = column.columnName,
        databaseType = column.databaseType,
        constraintType = column.constraintType;
  // Custom

  if (/.*Volume$/.test(columnName) || columnName === 'volume') return 'GQLVolumeEnum';
  if (/.*Currency$/.test(columnName) || columnName === 'currency') return 'GQLCurrencyEnum';

  const postfix = _lodash2.default.last(_lodash2.default.split(_lodash2.default.snakeCase(columnName), '_'));

  if (constraintDef && constraintDef.includes('ARRAY')) {
    const re = /'([\w]*)'+/g;
    const types = [];
    let match = re.exec(constraintDef);
    while (match != null) {
      types.push(match[1]);
      match = re.exec(constraintDef);
    }
    return `(${_lodash2.default.join(_lodash2.default.map(types, item => `'${item}'`), ' | ')})`;
  }

  if (/^(?:json.*)(\s|$)/.test(databaseType)) {
    return 'Object';
  }

  if (/^(?:text|character|coordinates)(\s|$)/.test(databaseType)) {
    return 'string';
  }

  if (databaseType === 'boolean') {
    return 'boolean';
  }

  if (/^(?:bigint|integer|real|double)(\s|$)/.test(databaseType)) {
    if (postfix === 'id' || postfix === 'ids') return 'Id';
    if (constraintType === 'PRIMARY KEY' || constraintType === 'FOREIGN KEY') return 'Id';
    return 'number';
  }

  if (/^(?:timestamp|date|time.*)(\s|$)/.test(databaseType)) {
    return 'Date';
  }

  if (/^(?:ARRAY)(\s|$)/.test(databaseType)) {
    if (postfix === 'id' || postfix === 'ids') return 'Id[]';
    return 'string[]';
  }

  debug('unknown type', databaseType);
  return 'any';
};
//# sourceMappingURL=mapTypescriptType.js.map