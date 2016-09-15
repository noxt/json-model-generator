'use strict';


import nunjucks from 'nunjucks';
import mkdirp from 'mkdirp';
import fs from 'fs';
import _ from 'lodash';
import {ArrayField, ObjectField, EnumField} from './fields';


nunjucks.configure({autoescape: false});


export default class Renderer {

  constructor(outputPath, author, project, company, lang) {
    this.outputPath = outputPath;
    this.lang = lang;
    this.templateFilePath = './templates/' + lang + '.nunjucks';
    this.headerInfo = {
      projectName: project || '<PROJECT_NAME>',
      author: author || '<AUTHOR>',
      copyright: new Date().getFullYear() + ' ' + (company || '<COMPANY>')
    };
  }

  render(model) {
    var preparedModel = this._prepareModel(model);
    var output = nunjucks.render(this.templateFilePath, {
      header: this.headerInfo,
      model: preparedModel
    });

    // Write
    mkdirp(this.outputPath);
    fs.writeFile(this.outputPath + '/' + preparedModel.name + '.' + this.lang, output, function (err) {
      if (err) {
        console.error(err);
      }
    });
  }

  _prepareModel(model) {
    model.name = generateTypeName(model.name);

    Object.keys(model.required).forEach(reqIndex => {
      model.required[reqIndex] = generateKeyName(model.required[reqIndex]);
    });

    Object.keys(model.properties).forEach(propIndex => {
      model.properties[propIndex] = this._prepareProperty(model.properties[propIndex], model.required);
    });

    return model;
  }

  _prepareProperty(property, required) {
    property.name = generateKeyName(property.name);
    property.isRequired = required.indexOf(property.name) != -1;

    if (property.currentType == ArrayField.typeName) {
      if (property.itemField.currentType == ObjectField.typeName) {
        property.itemField.typeInfo = generateTypeName(property.itemField.typeInfo);
      } else {
        property.itemField.name = generateKeyName(property.itemField.name);
      }
    }

    if (property.currentType == ObjectField.typeName) {
      property.typeInfo = generateTypeName(property.typeInfo);
    }

    if (property.currentType == EnumField.typeName) {
      property.values = property.values.map(item => {
        return {
          'name': 'Value' + clear(item),
          'value': item
        }
      });
      property.typeInfo = _.upperFirst(clear(property.name)) + 'Enum';
    }

    return property;
  }

}



function clear(string) {
  return string.replace(/^([-_]*)/, '').replace(/[-_]([a-zа-я])/ig, function (all, letter) {
    return letter.toUpperCase();
  });
}

function generateKeyName(keyName) {
  var name = _.lowerFirst(clear(keyName));

  if (['class', 'enum', 'struct', 'for', 'type'].indexOf(name) != -1) {
    name += 'Name';
  }

  return name;
}

function generateTypeName(typeName) {
  var name = _.upperFirst(clear(typeName));

  if (name.endsWith('Type')) {
    name = name.replace('Type', '');
  }

  return name + 'JsonModel';
}