'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _nunjucks = require('nunjucks');

var _nunjucks2 = _interopRequireDefault(_nunjucks);

var _mkdirp = require('mkdirp');

var _mkdirp2 = _interopRequireDefault(_mkdirp);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _fields = require('./fields');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

_nunjucks2.default.configure({ autoescape: false });

var Renderer = function () {
  function Renderer(outputPath, author, project, company, lang) {
    _classCallCheck(this, Renderer);

    this.outputPath = outputPath;
    this.lang = lang;
    this.templateFilePath = './templates/' + lang + '.nunjucks';
    this.headerInfo = {
      projectName: project || '<PROJECT_NAME>',
      author: author || '<AUTHOR>',
      copyright: new Date().getFullYear() + ' ' + (company || '<COMPANY>')
    };
  }

  _createClass(Renderer, [{
    key: 'render',
    value: function render(model) {
      var preparedModel = this._prepareModel(model);
      var output = _nunjucks2.default.render(this.templateFilePath, {
        header: this.headerInfo,
        model: preparedModel
      });

      // Write
      (0, _mkdirp2.default)(this.outputPath);
      _fs2.default.writeFile(this.outputPath + '/' + preparedModel.name + '.' + this.lang, output, function (err) {
        if (err) {
          console.error(err);
        }
      });
    }
  }, {
    key: '_prepareModel',
    value: function _prepareModel(model) {
      var _this = this;

      model.name = generateTypeName(model.name);

      Object.keys(model.required).forEach(function (reqIndex) {
        model.required[reqIndex] = generateKeyName(model.required[reqIndex]);
      });

      Object.keys(model.properties).forEach(function (propIndex) {
        model.properties[propIndex] = _this._prepareProperty(model.properties[propIndex], model.required);
      });

      return model;
    }
  }, {
    key: '_prepareProperty',
    value: function _prepareProperty(property, required) {
      property.name = generateKeyName(property.name);
      property.isRequired = required.indexOf(property.name) != -1;

      if (property.currentType == _fields.ArrayField.typeName) {
        if (property.itemField.currentType == _fields.ObjectField.typeName) {
          property.itemField.typeInfo = generateTypeName(property.itemField.typeInfo);
        } else {
          property.itemField.name = generateKeyName(property.itemField.name);
        }
      }

      if (property.currentType == _fields.ObjectField.typeName) {
        property.typeInfo = generateTypeName(property.typeInfo);
      }

      if (property.currentType == _fields.EnumField.typeName) {
        property.values = property.values.map(function (item) {
          return {
            'name': 'Value' + clear(item),
            'value': item
          };
        });
        property.typeInfo = _lodash2.default.upperFirst(clear(property.name)) + 'Enum';
      }

      return property;
    }
  }]);

  return Renderer;
}();

exports.default = Renderer;


function clear(string) {
  return string.replace(/^([-_]*)/, '').replace(/[-_]([a-zа-я])/ig, function (all, letter) {
    return letter.toUpperCase();
  });
}

function generateKeyName(keyName) {
  var name = _lodash2.default.lowerFirst(clear(keyName));

  if (['class', 'enum', 'struct', 'for', 'type', 'extension'].indexOf(name) != -1) {
    name += 'Name';
  }

  return name;
}

function generateTypeName(typeName) {
  var name = _lodash2.default.upperFirst(clear(typeName));

  if (name.endsWith('Type')) {
    name = name.replace('Type', '');
  }

  return name + 'JsonModel';
}