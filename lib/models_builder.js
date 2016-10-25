'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ModelTypeInfo = exports.ModelsBuilder = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _parseFilepath = require('parse-filepath');

var _parseFilepath2 = _interopRequireDefault(_parseFilepath);

var _fields = require('./fields');

var Fields = _interopRequireWildcard(_fields);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ModelsBuilder = exports.ModelsBuilder = function () {
  function ModelsBuilder(jsonByFile) {
    var _this = this;

    _classCallCheck(this, ModelsBuilder);

    this.jsonByFile = jsonByFile;
    this.models = {};

    Object.keys(this.jsonByFile).forEach(function (file) {
      _this._buildModel(_this.jsonByFile[file], (0, _parseFilepath2.default)(file).name);
    });
  }

  _createClass(ModelsBuilder, [{
    key: '_buildModel',
    value: function _buildModel(json, name) {
      var _this2 = this;

      if ((typeof json === 'undefined' ? 'undefined' : _typeof(json)) != 'object') {
        throw new Error('Invalid object: ' + name);
      }

      var typeName = name;
      if (json.hasOwnProperty('id')) {
        typeName = json['id'].substring(1);
      }

      if (json.hasOwnProperty('definitions') && _typeof(json['definitions']) == 'object') {
        Object.keys(json['definitions']).forEach(function (definitionName) {
          _this2._buildModel(json['definitions'][definitionName], definitionName);
        });
      }

      if (json.hasOwnProperty('type') && json['type'] == Fields.ObjectField.typeName) {
        var newType = new ModelTypeInfo(typeName, json['title']);

        if (json.hasOwnProperty('properties') && _typeof(json['properties']) == 'object') {
          newType.properties = [];
          Object.keys(json['properties']).forEach(function (propName) {
            newType.properties.push(_this2._buildProperty(json['properties'][propName], propName));
          });
        }

        if (json.hasOwnProperty('required') && Array.isArray(json['required'])) {
          newType.required = json['required'];
        }

        if (this.models.hasOwnProperty(typeName) && this.models[typeName].properties.length != newType.properties.length) {
          throw new Error('Duplicate: ' + typeName);
        }

        this.models[typeName] = newType;
      }
    }
  }, {
    key: '_buildProperty',
    value: function _buildProperty(json, name) {
      var propTitle = json['title'];

      if (json.hasOwnProperty('$ref')) {
        var items = json['$ref'].split('/');
        var typeName = items[items.length - 1].replace(/#$/g, '').replace(/(.json)$/g, '');
        return new Fields.ObjectField(name, propTitle, typeName);
      }

      if (json.hasOwnProperty('enum') && Array.isArray(json['enum'])) {
        if (json.hasOwnProperty('type')) {
          var typeField;
          switch (json['type']) {
            case Fields.IntegerField.typeName:
              typeField = new Fields.IntegerField(name, propTitle);
              break;
            case Fields.StringField.typeName:
              typeField = new Fields.StringField(name, propTitle);
              break;
            default:
              throw new Error('Invalid enum type');
          }
          return new Fields.EnumField(name, propTitle, typeField, json['enum']);
        } else {
          console.log(json);
          throw new Error('Undefined enum type');
        }
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
            if (json.hasOwnProperty('items') && _typeof(json['items']) == 'object') {
              return new Fields.ArrayField(name, propTitle, this._buildProperty(json['items'], name + '_item'));
            }
            break;
          case Fields.ObjectField.typeName:
            this._buildModel(json, name);
            return new Fields.ObjectField(name, propTitle, name);
        }
      }
    }
  }]);

  return ModelsBuilder;
}();

var ModelTypeInfo = exports.ModelTypeInfo = function ModelTypeInfo(name, description) {
  _classCallCheck(this, ModelTypeInfo);

  this.name = name;
  this.description = description;
  this.properties = [];
  this.required = [];
};