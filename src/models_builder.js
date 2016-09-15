'use strict';


import parsePath from 'parse-filepath';
import * as Fields from './fields';


export class ModelsBuilder {

  constructor(jsonByFile) {
    this.jsonByFile = jsonByFile;
    this.models = {};

    Object.keys(this.jsonByFile).forEach(file => {
      var json = this.jsonByFile[file];
      this._buildModel(json, parsePath(file).name);
    });
  }

  _buildModel(json, name) {
    if (typeof json != 'object') {
      throw new Error('Invalid object: ' + name);
    }

    if (json.hasOwnProperty('definitions') && typeof json['definitions'] == 'object') {
      Object.keys(json['definitions']).forEach(definitionName => {
        this._buildModel(json['definitions'][definitionName], definitionName);
      });
    }

    if (json.hasOwnProperty('type') && json['type'] == Fields.ObjectField.typeName) {
      var newType = new ModelTypeInfo(name, json['title']);

      if (json.hasOwnProperty('properties') && typeof json['properties'] == 'object') {
        newType.properties = [];
        Object.keys(json['properties']).forEach(propName => {
          newType.properties.push(this._buildProperty(json['properties'][propName], propName));
        });
      }

      if (json.hasOwnProperty('required') && Array.isArray(json['required'])) {
        newType.required = json['required'];
      }

      if (this.models.hasOwnProperty(name) && this.models[name].properties.length != newType.properties.length) {
        throw new Error('Duplicate: ' + name);
      }

      this.models[name] = newType;
    }
  }

  _buildProperty(json, name) {
    var propTitle = json['title'];

    if (json.hasOwnProperty('$ref')) {
      var items = json['$ref'].split('/');
      var typeName = items[items.length-1].replace(/#$/g, '').replace(/(.json)$/g, '');
      return new Fields.ObjectField(name, propTitle, typeName);
    }

    if (json.hasOwnProperty('enum') && Array.isArray(json['enum'])) {
      return new Fields.EnumField(name, propTitle, json['enum']);
    }

    if (json.hasOwnProperty('type')) {
      switch (json['type']) {
        case Fields.BoolField.typeName:
          return new Fields.BoolField(name, propTitle);
        case Fields.IntegerField.typeName:
          return new Fields.IntegerField(name, propTitle);
        case Fields.StringField.typeName:
          return new Fields.StringField(name, propTitle);
        case Fields.FloatField.typeName:
          return new Fields.FloatField(name, propTitle);
        case Fields.ArrayField.typeName:
          if (json.hasOwnProperty('items') && typeof json['items'] == 'object') {
            return new Fields.ArrayField(name, propTitle, this._buildProperty(json['items'], name + '_item'));
          }
          break;
        case Fields.ObjectField.typeName:
          this._buildModel(json, name);
          return new Fields.ObjectField(name, propTitle, name);
      }
    }
  }

}


export class ModelTypeInfo {

  constructor(name, description) {
    this.name = name;
    this.description = description;
    this.properties = [];
    this.required = [];
  }

}
