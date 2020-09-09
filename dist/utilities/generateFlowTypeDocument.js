'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lodash = require('lodash');

const generateFlowTypeDeclarationBody = properties => {
  const sortedProperties = (0, _lodash.sortBy)(properties, 'name');

  const propertyDeclarations = [];

  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = sortedProperties[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      const column = _step.value;

      const colon = column.nullable ? '?: ?' : ': ';
      propertyDeclarations.push(column.name + colon + column.type);
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
declare type ${typeName} = {
  ${generateFlowTypeDeclarationBody(typeProperties).split('\n').join(',\n  ')}
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

  return typeDeclarations.join('\n');
};
//# sourceMappingURL=generateFlowTypeDocument.js.map