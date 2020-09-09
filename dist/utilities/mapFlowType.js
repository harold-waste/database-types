'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _factories = require('../factories');

const debug = (0, _factories.createDebug)('mapFlowType');

exports.default = databaseTypeName => {
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