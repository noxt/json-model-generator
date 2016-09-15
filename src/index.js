'use strict';


import SchemaParser from './schema_parser';
import { ModelsBuilder } from './models_builder';
import Renderer from './renderer';
import fs from 'fs';


try {
  var config = JSON.parse(fs.readFileSync('./jmg.config.json', 'utf8'));
} catch (e) {
  console.log('Empty Config file ', e);
}


var parser = new SchemaParser(config['input']);
var modelsBuilder = new ModelsBuilder(parser.parsedJSON);
var renderer = new Renderer(config.output, config.author, config.project, config.company, config.lang);
Object.keys(modelsBuilder.models).forEach(modelName => {
  renderer.render(modelsBuilder.models[modelName]);
});
