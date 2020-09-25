// @flow

import test from 'ava';
import mapFlowType from '../../src/utilities/mapFlowType';

const knownTypes = {
  bigint: 'number',
  boolean: 'boolean',
  character: 'string',
  coordinates: 'string',
  integer: 'number',
  json: 'Object',
  text: 'string',
  timestamp: 'Date'
};

test('correctly maps known types', (t) => {
  const databaseTypes = Object.keys(knownTypes);

  for (const databaseType of databaseTypes) {
    const flowType = knownTypes[databaseType];

    if (typeof flowType !== 'string') {
      throw new TypeError();
    }

    t.true(mapFlowType({
      columnName: 'test',
      constraintDef: 'test',
      constraintType: null,
      databaseType,
      nullable: false,
      tableName: 'test',
    }) === flowType, flowType);
  }
});
