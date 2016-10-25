'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Field = exports.Field = function Field(name, title) {
  _classCallCheck(this, Field);

  this.isRef = false;
  this.key = name;
  this.name = name;
  this.title = title;
  this.isRequired = false;
};

var IntegerField = exports.IntegerField = function (_Field) {
  _inherits(IntegerField, _Field);

  _createClass(IntegerField, null, [{
    key: 'typeName',
    get: function get() {
      return 'integer';
    }
  }]);

  function IntegerField(name, title) {
    _classCallCheck(this, IntegerField);

    var _this = _possibleConstructorReturn(this, (IntegerField.__proto__ || Object.getPrototypeOf(IntegerField)).call(this, name, title));

    _this.currentType = IntegerField.typeName;
    return _this;
  }

  return IntegerField;
}(Field);

var FloatField = exports.FloatField = function (_Field2) {
  _inherits(FloatField, _Field2);

  _createClass(FloatField, null, [{
    key: 'typeName',
    get: function get() {
      return 'number';
    }
  }]);

  function FloatField(name, title) {
    _classCallCheck(this, FloatField);

    var _this2 = _possibleConstructorReturn(this, (FloatField.__proto__ || Object.getPrototypeOf(FloatField)).call(this, name, title));

    _this2.currentType = FloatField.typeName;
    return _this2;
  }

  return FloatField;
}(Field);

var StringField = exports.StringField = function (_Field3) {
  _inherits(StringField, _Field3);

  _createClass(StringField, null, [{
    key: 'typeName',
    get: function get() {
      return 'string';
    }
  }]);

  function StringField(name, title) {
    _classCallCheck(this, StringField);

    var _this3 = _possibleConstructorReturn(this, (StringField.__proto__ || Object.getPrototypeOf(StringField)).call(this, name, title));

    _this3.currentType = StringField.typeName;
    return _this3;
  }

  return StringField;
}(Field);

var BoolField = exports.BoolField = function (_Field4) {
  _inherits(BoolField, _Field4);

  _createClass(BoolField, null, [{
    key: 'typeName',
    get: function get() {
      return 'boolean';
    }
  }]);

  function BoolField(name, title) {
    _classCallCheck(this, BoolField);

    var _this4 = _possibleConstructorReturn(this, (BoolField.__proto__ || Object.getPrototypeOf(BoolField)).call(this, name, title));

    _this4.currentType = BoolField.typeName;
    return _this4;
  }

  return BoolField;
}(Field);

var ArrayField = exports.ArrayField = function (_Field5) {
  _inherits(ArrayField, _Field5);

  _createClass(ArrayField, null, [{
    key: 'typeName',
    get: function get() {
      return 'array';
    }
  }]);

  function ArrayField(name, title, itemField) {
    _classCallCheck(this, ArrayField);

    var _this5 = _possibleConstructorReturn(this, (ArrayField.__proto__ || Object.getPrototypeOf(ArrayField)).call(this, name, title));

    _this5.isRef = true;
    _this5.itemField = itemField;
    _this5.currentType = ArrayField.typeName;
    return _this5;
  }

  return ArrayField;
}(Field);

var ObjectField = exports.ObjectField = function (_Field6) {
  _inherits(ObjectField, _Field6);

  _createClass(ObjectField, null, [{
    key: 'typeName',
    get: function get() {
      return 'object';
    }
  }]);

  function ObjectField(name, title, typeInfo) {
    _classCallCheck(this, ObjectField);

    var _this6 = _possibleConstructorReturn(this, (ObjectField.__proto__ || Object.getPrototypeOf(ObjectField)).call(this, name, title));

    _this6.isRef = true;
    _this6.typeInfo = typeInfo;
    _this6.currentType = ObjectField.typeName;
    return _this6;
  }

  return ObjectField;
}(Field);

var EnumField = exports.EnumField = function (_Field7) {
  _inherits(EnumField, _Field7);

  _createClass(EnumField, null, [{
    key: 'typeName',
    get: function get() {
      return 'enum';
    }
  }]);

  function EnumField(name, title, valueType, values) {
    _classCallCheck(this, EnumField);

    var _this7 = _possibleConstructorReturn(this, (EnumField.__proto__ || Object.getPrototypeOf(EnumField)).call(this, name, title));

    _this7.isRef = true;
    _this7.valueType = valueType;
    _this7.values = values;
    _this7.currentType = EnumField.typeName;
    _this7.typeInfo = name;
    return _this7;
  }

  return EnumField;
}(Field);