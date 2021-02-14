// @flow

import type {
  ColumnType,
  UnnormalizedColumnType
} from '../types';

export default (unnormalizedColumns: $ReadOnlyArray<UnnormalizedColumnType>): $ReadOnlyArray<ColumnType> => {
  const normalizedColumns = unnormalizedColumns.map((column) => {
    const valueIsNullable = column.isNullable === 'YES';

    return {
      columnName: column.columnName,
      constraintDef: column.constraintDef,
      constraintType: column.constraintType,
      databaseType: column.dataType,
      nullable: valueIsNullable,
      refTableColumn: column.refTableColumn,
      refTableName: column.refTableName,
      tableName: column.tableName,
    };
  });

  return normalizedColumns;
};
