'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = unnormalizedColumns => {
  const normalizedColumns = unnormalizedColumns.map(column => {
    const valueIsNullable = column.isNullable === 'YES';

    return {
      columnName: column.columnName,
      constraintDef: column.constraintDef,
      constraintType: column.constraintType,
      databaseType: column.dataType,
      nullable: valueIsNullable,
      refTableColumn: column.refTableColumn,
      refTableName: column.refTableName,
      tableName: column.tableName
    };
  });

  return normalizedColumns;
};
//# sourceMappingURL=normalizeColumns.js.map