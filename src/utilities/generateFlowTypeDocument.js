// @flow

import {
  groupBy,
  sortBy
} from 'lodash';
import type {
  TypePropertyType
} from '../types';

const generateFlowTypeDeclarationBody = (properties: $ReadOnlyArray<TypePropertyType>): string => {
  const sortedProperties = sortBy(properties, 'name');

  const propertyDeclarations = [];

  for (const column of sortedProperties) {
    const colon = column.nullable ? '?: ?' : ': ';
    propertyDeclarations.push(column.name + colon + column.type);
  }

  return propertyDeclarations.join('\n');
};

export default (
  columns: $ReadOnlyArray<TypePropertyType>
): string => {
  const groupedProperties = groupBy(columns, 'typeName');

  const typeDeclarations = [];

  const typeNames = Object.keys(groupedProperties);

  for (const typeName of typeNames) {
    const typeProperties = groupedProperties[typeName];

    const typeDeclaration = `
declare type ${typeName} = {
  ${generateFlowTypeDeclarationBody(typeProperties).split('\n').join(',\n  ')}
};`;

    typeDeclarations.push(typeDeclaration);
  }

  return typeDeclarations.join('\n');
};
