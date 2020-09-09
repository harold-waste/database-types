'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = unnormalizedColumns => {
  const normalizedColumns = unnormalizedColumns.map(column => {
    const valueIsNullable = column.isNullable === 'YES';

    return {
      columnName: column.columnName,
      databaseType: column.dataType,
      nullable: valueIsNullable,
      tableName: column.tableName
    };
  });

  return normalizedColumns;
};
//# sourceMappingURL=normalizeColumns.js.map