'use strict';


import SchemaParser from './schema_parser';
import { ModelsBuilder } from './models_builder';
import Renderer from './renderer';
import fs from 'fs';
import { ObjectField, ArrayField } from './fields';


try {
  var config = JSON.parse(fs.readFileSync('./jmg.config.json', 'utf8'));
} catch (e) {
  console.log('Empty Config file ', e);
}


var parser = new SchemaParser(config['input']);
var modelsBuilder = new ModelsBuilder(parser.parsedJSON);
var renderer = new Renderer(config['output'], config['author'], config['project'], config['company'], config['lang']);

Object.keys(modelsBuilder.models).forEach(modelName => {
  var model = modelsBuilder.models[modelName];


  Object.keys(model.properties).forEach(propertyIndex => {
    var property = model.properties[propertyIndex];

    if (property.currentType == ObjectField.typeName && !modelsBuilder.models.hasOwnProperty(property.typeInfo)) {
      throw new Error('Not found class: ' + property.typeInfo);
    }

    if (property.currentType == ArrayField.typeName && property.itemField.typeInfo != undefined && !modelsBuilder.models.hasOwnProperty(property.itemField.typeInfo)) {
      throw new Error('Not found class: ' + property.itemField.typeInfo);
    }
  });
});

Object.keys(modelsBuilder.models).forEach(modelName => {
  renderer.render(modelsBuilder.models[modelName]);
});
