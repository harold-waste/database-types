// @flow

import {
  createDebug
} from '../factories';

const debug = createDebug('mapFlowType');

export default (databaseTypeName: string): string => {
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
