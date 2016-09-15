'use strict';

var _schema_parser = require('./schema_parser');

var _schema_parser2 = _interopRequireDefault(_schema_parser);

var _models_builder = require('./models_builder');

var _renderer = require('./renderer');

var _renderer2 = _interopRequireDefault(_renderer);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _fields = require('./fields');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

try {
  var config = JSON.parse(_fs2.default.readFileSync('./jmg.config.json', 'utf8'));
} catch (e) {
  console.log('Empty Config file ', e);
}

var parser = new _schema_parser2.default(config['input']);
var modelsBuilder = new _models_builder.ModelsBuilder(parser.parsedJSON);
var renderer = new _renderer2.default(config['output'], config['author'], config['project'], config['company'], config['lang']);

Object.keys(modelsBuilder.models).forEach(function (modelName) {
  var model = modelsBuilder.models[modelName];

  Object.keys(model.properties).forEach(function (propertyIndex) {
    var property = model.properties[propertyIndex];

    if (property.currentType == _fields.ObjectField.typeName && !modelsBuilder.models.hasOwnProperty(property.typeInfo)) {
      throw new Error('Not found class: ' + property.typeInfo);
    }

    if (property.currentType == _fields.ArrayField.typeName && property.itemField.typeInfo != undefined && !modelsBuilder.models.hasOwnProperty(property.itemField.typeInfo)) {
      throw new Error('Not found class: ' + property.itemField.typeInfo);
    }
  });
});

Object.keys(modelsBuilder.models).forEach(function (modelName) {
  renderer.render(modelsBuilder.models[modelName]);
});