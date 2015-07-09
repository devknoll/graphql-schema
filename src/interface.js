import BaseObject from './baseObject';
import { GraphQLInterfaceType } from 'graphql';

class Interface extends BaseObject {
  resolve(resolve) {
    this.resolveType = resolve;
    return this;
  }

  end() {
    const { resolveType } = this;

    return new GraphQLInterfaceType({
      ...super(),
      resolveType
    });
  }
}

export default function interfaceType(...args) {
  return new Interface(...args);
}
