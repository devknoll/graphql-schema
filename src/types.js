import {
  GraphQLList
} from 'graphql';

export function listOf(type) {
  return new GraphQLList(type);
}
