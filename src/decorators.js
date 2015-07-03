import { GraphQLObjectType } from 'graphql';

export function object(name, description = null) {
  return function objectDecorator(target) {
    const typeGenerator = target.__graphqlTypeGenerator = function typeGenerator() {
      return new GraphQLObjectType({
        name: name,
        description: description,
        fields: () => (target.prototype.__graphqlFields)
      });
    };

    for (const key of Object.keys(target.prototype.__graphqlFields)) {
      const fd = target.prototype.__graphqlFields[key];
      const { type } = fd;

      if (type.__graphqlTypeGenerator) {
        fd.type = type.__graphqlTypeGenerator();
      } else if (type.ofType && type.ofType.__graphqlTypeGenerator) {
        type.ofType = type.ofType.__graphqlTypeGenerator();
      }
    }

    return typeGenerator();
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

export function arg(type, name, description = null) {
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

export function deprecated(reason) {
  return function deprecatedDecorator(target, key) {
    target.__graphqlFields = target.__graphqlFields || {};
    const fd = target.__graphqlFields[key] = target.__graphqlFields[key] || {};

    fd.deprecationReason = reason;
  };
}
