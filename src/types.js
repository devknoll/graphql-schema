import {
  GraphQLList,
  GraphQLNonNull,
  GraphQLSchema
} from 'graphql';

export function listOf(type) {
  return new GraphQLList(type);
}

export function notNull(type) {
  return new GraphQLNonNull(type);
}

export function schemaFrom(type) {
  return new GraphQLSchema({
    query: type
  });
}
