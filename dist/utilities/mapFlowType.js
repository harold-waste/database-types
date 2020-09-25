'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _factories = require('../factories');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const debug = (0, _factories.createDebug)('mapFlowType');

exports.default = column => {
  const constraintDef = column.constraintDef,
        columnName = column.columnName,
        databaseType = column.databaseType,
        constraintType = column.constraintType;
  // Custom

  if (/.*Volume$/.test(columnName) || columnName === 'volume') return 'GQLVolumeEnum';
  if (/.*Currency$/.test(columnName) || columnName === 'currency') return 'GQLCurrencyEnum';

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

  if (/^(?:bigint|integer|real)(\s|$)/.test(databaseType)) {
    if (constraintType === 'PRIMARY KEY' || constraintType === 'FOREIGN KEY') return 'Id';
    return 'number';
  }

  if (/^(?:timestamp|date|time.*)(\s|$)/.test(databaseType)) {
    return 'Date';
  }

  if (/^(?:ARRAY)(\s|$)/.test(databaseType)) {
    return 'Array<string>';
  }

  debug('unknown type', databaseType);
  return 'any';
};
//# sourceMappingURL=mapFlowType.js.map