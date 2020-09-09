// @flow

import {
  sql
} from 'mightyql';
import type {
  DatabaseConnectionType,
  UnnormalizedColumnType
} from '../types';

export default async (connection: DatabaseConnectionType, schema: string): Promise<$ReadOnlyArray<UnnormalizedColumnType>> => {
  return connection.any(sql`
    SELECT
      table_name "tableName",
      column_name "columnName",
      is_nullable "isNullable",
      data_type "dataType"
    FROM information_schema.columns
    WHERE table_schema = ${schema}
  `);
};
