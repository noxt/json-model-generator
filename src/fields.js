'use strict';


export class Field {
  constructor(name, title) {
    this.isRef = false;
    this.key = name;
    this.name = name;
    this.title = title;
    this.isRequired = false;
  }
}


export class IntegerField extends Field {
  static get typeName() {
    return 'integer';
  }

  constructor(name, title) {
    super(name, title);
    this.currentType = IntegerField.typeName;
  }
}


export class FloatField extends Field {
  static get typeName() {
    return 'number';
  }

  constructor(name, title) {
    super(name, title);
    this.currentType = FloatField.typeName;
  }
}


export class StringField extends Field {
  static get typeName() {
    return 'string';
  }

  constructor(name, title) {
    super(name, title);
    this.currentType = StringField.typeName;
  }
}


export class BoolField extends Field {
  static get typeName() {
    return 'boolean';
  }

  constructor(name, title) {
    super(name, title);
    this.currentType = BoolField.typeName;
  }
}


export class ArrayField extends Field {
  static get typeName() {
    return 'array';
  }

  constructor(name, title, itemField) {
    super(name, title);
    this.isRef = true;
    this.itemField = itemField;
    this.currentType = ArrayField.typeName;
  }
}


export class ObjectField extends Field {
  static get typeName() {
    return 'object';
  }

  constructor(name, title, typeInfo) {
    super(name, title);
    this.isRef = true;
    this.typeInfo = typeInfo;
    this.currentType = ObjectField.typeName;
  }
}

export class EnumField extends Field {
  static get typeName() {
    return 'enum';
  }

  constructor(name, title, valueType, values) {
    super(name, title);
    this.isRef = true;
    this.valueType = valueType;
    this.values = values;
    this.currentType = EnumField.typeName;
    this.typeInfo = name;
  }
}
