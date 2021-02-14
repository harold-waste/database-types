// @flow

export type {
  DatabaseConnectionType
} from 'mightyql';

export type ConstraintType = 'FOREIGN KEY' | 'PRIMARY KEY';

export type UnnormalizedColumnType = {|
  +columnName: string,
  +constraintDef: ?string,
  +constraintType: ?ConstraintType,
  +dataType: string,
  +isNullable: 'YES' | 'NO',
  +refTableColumn: ?string,
  +refTableName: ?string,
  +tableName: string,
|};

export type ColumnType = {|
  +columnName: string,
  +constraintDef: ?string,
  +constraintType: ?ConstraintType,
  +databaseType: string,
  +nullable: boolean,
  +refTableColumn: ?string,
  +refTableName: ?string,
  +tableName: string,
|};

export type TypePropertyType = {|
  +constraintDef: ?string,
  +constraintType: ?ConstraintType,
  +formatTypeName: Function,
  +name: string,
  +nullable: boolean,
  +refTableColumn: ?string,
  +refTableName: ?string,
  +tableName: string,
  +type: string,
  +typeName: string,
|};
