import { GraphQLObjectType } from 'graphql';

export function object(name, description = null) {
  return function objectDecorator(target) {
    return new GraphQLObjectType({
      name: name,
      description: description,
      fields: () => (target.prototype.__graphqlFields)
    });
  };
}

export function field(type, description = null) {
  return function fieldDecorator(target, key, descriptor) {
    target.__graphqlFields = target.__graphqlFields || {};
    const fd = target.__graphqlFields[key] = target.__graphqlFields[key] || {};

    fd.resolve = descriptor.value;
    fd.description = description;
    fd.type = type;
  };
}

export function arg(name, type, description = null) {
  return function argDecorator(target, key) {
    target.__graphqlFields = target.__graphqlFields || {};
    const fd = target.__graphqlFields[key] = target.__graphqlFields[key] || {};
    const args = fd.args = fd.args || {};

    args[name] = {
      name,
      type,
      description
    };
  };
}
