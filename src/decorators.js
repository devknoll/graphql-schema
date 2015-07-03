import { GraphQLObjectType } from 'graphql';

function generateType(name, prototype) {
  return new GraphQLObjectType({
    name: name,
    description: prototype.__graphqlDescription,
    fields: () => (prototype.__graphqlFields)
  });
}

export function type(nameOrType) {
  return function typeDecorator(target, key, descriptor) {
    if (typeof key === 'undefined') {
      return generateType(nameOrType, target.prototype);
    }

    target.__graphqlFields = target.__graphqlFields || {};
    let field = target.__graphqlFields[key] = target.__graphqlFields[key] || {};

    field.resolve = descriptor.value;
    field.type = nameOrType;
  };
}

export function description(desc) {
  return function descriptionDecorator(target, key) {
    if (typeof key === 'undefined') {
      target.prototype.__graphqlDescription = desc;
      return;
    }

    target.__graphqlFields = target.__graphqlFields || {};
    let field = target.__graphqlFields[key] = target.__graphqlFields[key] || {};

    field.description = desc;
  };
}
