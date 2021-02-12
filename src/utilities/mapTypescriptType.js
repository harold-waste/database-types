// @flow

import _ from 'lodash';
import {
  createDebug
} from '../factories';
import type {
  ConstraintType,
  ColumnType,
} from '../types';

const debug = createDebug('mapTypescriptType');

export default (column: ColumnType): string => {
  const { constraintDef, columnName, databaseType, constraintType } = column;
  // Custom
  if (/.*Volume$/.test(columnName) || columnName === 'volume') return 'GQLVolumeEnum';
  if (/.*Currency$/.test(columnName) || columnName === 'currency') return 'GQLCurrencyEnum';

  const postfix = _.last(_.split(_.snakeCase(columnName), '_'));

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
    if ((constraintType === 'PRIMARY KEY' || constraintType === 'FOREIGN KEY')) return 'Id';
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
