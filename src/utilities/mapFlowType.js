// @flow

import _ from 'lodash';
import {
  createDebug
} from '../factories';
import type {
  ConstraintType,
} from '../types';

const debug = createDebug('mapFlowType');

export default (databaseTypeName: string, constraintType: ?ConstraintType, constraintDef: ?string): string => {
  if (constraintDef && constraintDef.includes('ARRAY')) {
    const re = /'([\w]*)'+/g
    const types = [];
    let match = re.exec(constraintDef);
    while (match != null) {
      types.push(match[1]);
      match = re.exec(constraintDef);
    }
    return `(${_.join(_.map(types, (item) =>`'${item}'`), ' | ')})`;
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
    if ((constraintType === 'PRIMARY KEY' || constraintType === 'FOREIGN KEY')) return 'Id';
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
