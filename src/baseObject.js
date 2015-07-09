import invariant from 'invariant';

function resolveFields(fields) {
  const fieldNames = Object.keys(fields);
  const fieldDefs = {};

  for (const fieldName of fieldNames) {
    const field = fields[fieldName];
    const { type } = field;

    fieldDefs[fieldName] = {
      ...field,
      args: resolveFields(field.args || {}),
      type: typeof type === 'function' ? type() : type
    };
  }

  return fieldDefs;
}

export default class BaseObject {
  constructor(name, interfaces, description) {
    if (!description) {
      /* eslint-disable no-param-reassign */
      description = interfaces;
      interfaces = undefined;
      /* eslint-enable no-param-reassign */
    }

    this.name = name;
    this.description = description;
    this.interfaces = interfaces;

    this.__field = null;
    this.fields = {};
  }

  __saveField() {
    if (this.__field) {
      this.fields[this.__field.name] = this.__field;
      this.__field = null;
    }
  }

  field(name, type, description, resolve) {
    if (typeof description === 'function') {
      /* eslint-disable no-param-reassign */
      resolve = description;
      description = null;
      /* eslint-enable no-param-reassign */
    }

    invariant(
      !this.fields[name],
      `field(...): '${name}' is already defined`
    );

    invariant(
      type,
      `field(...): '${name}' has an undefined or null type. If you ` +
      `are trying to refer to '${this.name}' then you should use a function`
    );

    this.__saveField();

    this.__field = {
      name,
      type,
      description,
      resolve,
      args: {}
    };

    return this;
  }

  arg(name, type, defaultValue, description) {
    if (!description) {
      /* eslint-disable no-param-reassign */
      description = defaultValue;
      defaultValue = undefined;
      /* eslint-enable no-param-reassign */
    }

    invariant(
      this.__field,
      `arg(...): '${name}' must appear under a field`
    );

    invariant(
      !this.__field.args[name],
      `arg(...): '${name}' is already defined by ${this.__field.name}`
    );

    this.__field.args[name] = {
      name,
      type,
      description,
      defaultValue
    };

    return this;
  }

  deprecated(reason) {
    invariant(
      this.__field,
      `deprecated(...): Deprecations must appear under a field`
    );

    this.__field.deprecationReason = reason;
    return this;
  }

  end() {
    this.__saveField();

    const { name, description } = this;

    return {
      name,
      description,
      fields: () => resolveFields(this.fields)
    };
  }
}
