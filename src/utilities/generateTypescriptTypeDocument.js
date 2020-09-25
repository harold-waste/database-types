// @flow

import {
  groupBy,
  sortBy,
} from 'lodash';
import type {
  TypePropertyType
} from '../types';

const generateTypescriptTypeDeclarationBody = (properties: $ReadOnlyArray<TypePropertyType>): string => {
  const sortedProperties = sortBy(properties, 'name');

  const propertyDeclarations = [];

  for (const column of sortedProperties) {
    const nullable = column.nullable ? ' | null | undefined' : '';
    propertyDeclarations.push(column.name + ': ' + column.type + nullable);
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
export type ${typeName} = {
  ${generateTypescriptTypeDeclarationBody(typeProperties).split('\n').join(',\n  ')}
};`;

    typeDeclarations.push(typeDeclaration);
  }

  return typeDeclarations.join('\n');
};
