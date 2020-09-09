'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _factories = require('../factories');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const debug = (0, _factories.createDebug)('mapFlowType');

exports.default = (databaseTypeName, constraintType, constraintDef) => {
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

  if (/^(?:json.*)(\s|$)/.test(databaseTypeName)) {
    return 'Object';
  }

  if (/^(?:text|character|coordinates)(\s|$)/.test(databaseTypeName)) {
    return 'string';
  }

  if (databaseTypeName === 'boolean') {
    return 'boolean';
  }

  if (/^(?:bigint|integer|real)(\s|$)/.test(databaseTypeName)) {
    if (constraintType === 'PRIMARY KEY' || constraintType === 'FOREIGN KEY') return 'Id';
    return 'number';
  }

  if (/^(?:timestamp|date|time.*)(\s|$)/.test(databaseTypeName)) {
    return 'Date';
  }

  if (/^(?:ARRAY)(\s|$)/.test(databaseTypeName)) {
    return 'Array<string>';
  }

  debug('unknown type', databaseTypeName);
  return 'any';
};
//# sourceMappingURL=mapFlowType.js.map