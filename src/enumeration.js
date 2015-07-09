import invariant from 'invariant';
import { GraphQLEnumType } from 'graphql';

class Enumeration {
  constructor(name, description) {
    this.name = name;
    this.description = description;
    this.values = {};
    this.lastValue = null;
  }

  value(name, value, description) {
    invariant(
      !this.values[name],
      `value(...): '${name}' is already defined`
    );

    this.lastValue = this.values[name] = {
      value,
      description
    };

    return this;
  }

  deprecated(deprecationReason) {
    invariant(
      this.lastValue,
      `deprecated(...): Deprecated must appear after a value`
    );

    this.lastValue.deprecationReason = deprecationReason;
    return this;
  }

  end() {
    const { name, description, values } = this;

    return new GraphQLEnumType({
      name,
      description,
      values
    });
  }
}

export default function enumType(...args) {
  return new Enumeration(...args);
}
