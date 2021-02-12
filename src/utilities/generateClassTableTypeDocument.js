// @flow

import {
  groupBy,
  sortBy,
} from 'lodash';
import type {
  TypePropertyType
} from '../types';

const generateClassTableTypeDeclarationBody = (properties: $ReadOnlyArray<TypePropertyType>): string => {
  const sortedProperties = sortBy(properties, 'name');

  const propertyDeclarations = [];

  for (const column of sortedProperties) {
    const nullable = column.nullable ? ' | null | undefined' : '';
    const colon = column.nullable ? '?: ' : ': ';
    const primary = (column.constraintType === 'PRIMARY KEY') ? '{ primary: true }' : '';
    propertyDeclarations.push('\t@Column('+ primary +')');
    propertyDeclarations.push('\tpublic ' + column.name + colon + column.type + nullable + ';');
  }

  return propertyDeclarations.join('\n');
};

export default (
  columns: $ReadOnlyArray<TypePropertyType>
): string => {
  const groupedProperties = groupBy(columns, 'typeName');

  const typeDeclarations = [];

  const typeNames = Object.keys(groupedProperties).sort();

  for (const typeName of typeNames) {
    const typeProperties = groupedProperties[typeName];

    const typeDeclaration = `
@Table("${typeProperties[0].tableName}")
export class ${typeName} {
${generateClassTableTypeDeclarationBody(typeProperties)}
};`;

    typeDeclarations.push(typeDeclaration);
  }
  const importText = "import { Column, Table } from '@wwwouter/typed-knex'; \n"
  return importText + typeDeclarations.join('\n');
};
