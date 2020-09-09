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
  +tableName: string,
|};

export type ColumnType = {|
  +columnName: string,
  +constraintDef: ?string,
  +constraintType: ?ConstraintType,
  +databaseType: string,
  +nullable: boolean,
  +tableName: string,
|};

export type TypePropertyType = {|
  +name: string,
  +nullable: boolean,
  +type: string,
  +typeName: string,
|};
