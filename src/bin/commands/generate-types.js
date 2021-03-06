// @flow

/* eslint-disable no-new-func */

import _, {
  camelCase,
  upperFirst,
} from 'lodash';
import {
  createConnection
} from 'mightyql';
import type {
  ColumnType,
  TypePropertyType
} from '../../types';
import {
  getDatabaseTableColumns,
  getDatabaseMaterializedViewColumns
} from '../../queries';
import {
  generateFlowTypeDocument,
  generateTypescriptTypeDocument,
  generateClassTableTypeDocument,
  mapFlowType,
  mapTypescriptType,
  mapClassTableType,
  normalizeColumns,
} from '../../utilities';

export const command = 'generate-types';
export const desc = 'Generate types for a Postgres database.';

type ConfigurationType = {|
  +columnFilter: string,
  +databaseConnectionUri: string,
  +dialect: 'flow' | 'typescript' | 'class/table',
  +schema: 'public',
  +includeMaterializedViews: boolean,
  +propertyNameFormatter: string | null,
  +typeNameFormatter: string | null
|};

export const builder = (yargs: *): void => {
  yargs
    .options({
      'column-filter': {
        description: 'Function used to filter columns. Function is constructed using `new Function`. Function receives table name as the first parameter and column name as the second parameter (parameter names are "tableName" and "columnName").',
        type: 'string'
      },
      'database-connection-uri': {
        demand: true
      },
      dialect: {
        choices: [
          'flow',
          'typescript',
          'class/table',
        ],
        demand: true
      },
      schema: {
        demand: true
      },
      'include-materialized-views': {
        default: true,
        type: 'boolean'
      },
      'property-name-formatter': {
        default: null,
        description: 'Function used to format property name. Function is constructed using `new Function`. Function receives column name as the first parameter (parameter name is "columnName"). The default behaviour is to (lower) camelCase the column name.',
        type: 'string'
      },
      'type-name-formatter': {
        default: null,
        description: 'Function used to format type name. Function is constructed using `new Function`. Function receives table name as the first parameter (parameter name is "tableName"). The default behaviour is to (upper) CamelCase the table name and prefix it with "PSQL".',
        type: 'string'
      }
    });
};

type ColumnFilterType = (tableName: string, columnName: string) => boolean;
type FormatterType = (name: string, upperFirst: Function) => string;

export const handler = async (argv: ConfigurationType): Promise<void> => {
  const defaultFormatTypeName = (tableName: string): string => {
    return 'PSQL' + upperFirst(camelCase(tableName));
  };

  const defaultFormatPropertyName = (columnName: string): string => {
    return columnName;
  };

  // eslint-disable-next-line no-extra-parens
  const filterColumns: ColumnFilterType = (argv.columnFilter ? new Function('tableName', 'columnName', argv.columnFilter) : null: any);

  // eslint-disable-next-line no-extra-parens
  const formatTypeName: FormatterType = (argv.typeNameFormatter ? new Function('tableName', '_', argv.typeNameFormatter) : defaultFormatTypeName: any);
  // eslint-disable-next-line no-extra-parens
  const formatPropertyName: FormatterType = (argv.propertyNameFormatter ? new Function('columnName', argv.propertyNameFormatter) : defaultFormatPropertyName: any);

  const createProperties = (columns: $ReadOnlyArray<ColumnType>): $ReadOnlyArray<TypePropertyType> => {
    let filteredColumns = columns;

    if (filterColumns) {
      filteredColumns = filteredColumns.filter((column) => {
        // $FlowFixMe
        return filterColumns(column.tableName, column.columnName);
      });
    }

    return filteredColumns.map((column) => {
      return {
        name: formatPropertyName(column.columnName),
        nullable: column.nullable,
        type: {
          flow: mapFlowType(column),
          typescript: mapTypescriptType(column),
          'class/table': mapClassTableType(column),
        }[argv.dialect],
        typeName: formatTypeName(column.tableName, _),
        constraintType: column.constraintType,
        constraintDef: column.constraintDef,
        tableName: column.tableName,
        refTableName: column.refTableName,
        refTableColumn: column.refTableColumn,
        formatTypeName,
      };
    });
  };

  const connection = await createConnection(argv.databaseConnectionUri);

  let unnormalizedColumns;

  unnormalizedColumns = await getDatabaseTableColumns(connection, argv.schema);

  if (argv.includeMaterializedViews) {
    unnormalizedColumns = unnormalizedColumns.concat(await getDatabaseMaterializedViewColumns(connection));
  }

  const normalizedColumns = normalizeColumns(unnormalizedColumns);

  const properties = createProperties(normalizedColumns);

  // eslint-disable-next-line no-console
  if (argv.dialect === 'flow') console.log(generateFlowTypeDocument(properties));
  // eslint-disable-next-line no-console
  if (argv.dialect === 'typescript') console.log(generateTypescriptTypeDocument(properties));
  // eslint-disable-next-line no-console
  if (argv.dialect === 'class/table') console.log(generateClassTableTypeDocument(properties));
  await connection.end();
};
