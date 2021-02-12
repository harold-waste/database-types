'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lodash = require('lodash');

const generateClassTableTypeDeclarationBody = properties => {
  const sortedProperties = (0, _lodash.sortBy)(properties, 'name');

  const propertyDeclarations = [];

  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = sortedProperties[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      const column = _step.value;

      const nullable = column.nullable ? ' | null | undefined' : '';
      const colon = column.nullable ? '?: ' : ': ';
      const primary = column.constraintType === 'PRIMARY KEY' ? '{ primary: true }' : '';
      propertyDeclarations.push('\t@Column(' + primary + ')');
      propertyDeclarations.push('\tpublic ' + column.name + colon + column.type + nullable + ';');
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  return propertyDeclarations.join('\n');
};

exports.default = columns => {
  const groupedProperties = (0, _lodash.groupBy)(columns, 'typeName');

  const typeDeclarations = [];

  const typeNames = Object.keys(groupedProperties).sort();

  var _iteratorNormalCompletion2 = true;
  var _didIteratorError2 = false;
  var _iteratorError2 = undefined;

  try {
    for (var _iterator2 = typeNames[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
      const typeName = _step2.value;

      const typeProperties = groupedProperties[typeName];

      const typeDeclaration = `
@Table("${typeProperties[0].tableName}")
export class ${typeName} {
${generateClassTableTypeDeclarationBody(typeProperties)}
};`;

      typeDeclarations.push(typeDeclaration);
    }
  } catch (err) {
    _didIteratorError2 = true;
    _iteratorError2 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion2 && _iterator2.return) {
        _iterator2.return();
      }
    } finally {
      if (_didIteratorError2) {
        throw _iteratorError2;
      }
    }
  }

  const importText = "import { Column, Table } from '@wwwouter/typed-knex'; \n";
  return importText + typeDeclarations.join('\n');
};
//# sourceMappingURL=generateClassTableTypeDocument.js.map