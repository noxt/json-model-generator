'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _parseFilepath = require('parse-filepath');

var _parseFilepath2 = _interopRequireDefault(_parseFilepath);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SchemaParser = function () {
  function SchemaParser(path) {
    _classCallCheck(this, SchemaParser);

    this.parsedJSON = {};
    this._parseAllFiles(path);
  }

  _createClass(SchemaParser, [{
    key: '_parseAllFiles',
    value: function _parseAllFiles(path) {
      var _this = this;

      _fs2.default.accessSync(path);
      var stat = _fs2.default.lstatSync(path);
      var filesContent = {};

      if (stat.isDirectory()) {
        getFiles(path).filter(function (file) {
          return file.endsWith('.json');
        }).forEach(function (file) {
          _this._parseFile(file);
        });
      } else if (stat.isFile() && path.endsWith('.json')) {
        this._parseFile(path);
      }
    }
  }, {
    key: '_parseFile',
    value: function _parseFile(file) {
      var fileName = (0, _parseFilepath2.default)(file).name;
      console.log('> Parsing', fileName);

      try {
        var content = _fs2.default.readFileSync(file, 'utf8');
        this.parsedJSON[file] = JSON.parse(content);
      } catch (e) {
        console.log('Parsing error: ', e);
      }
    }
  }]);

  return SchemaParser;
}();

exports.default = SchemaParser;


function getFiles(dir, files) {
  files = files || [];
  var dirFiles = _fs2.default.readdirSync(dir);
  for (var fileIndex in dirFiles) {
    var name = dir + '/' + dirFiles[fileIndex];
    if (_fs2.default.statSync(name).isDirectory()) {
      getFiles(name, files);
    } else {
      files.push(name);
    }
  }
  return files;
}