import invariant from 'invariant';
import BaseObject from './baseObject';
import { GraphQLObjectType } from 'graphql';

class Obj extends BaseObject {
  resolve(resolve) {
    invariant(
      this.__field,
      `resolve(...): Resolve must appear under a field`
    );

    this.__field.resolve = resolve;
    return this;
  }

  isTypeOf(isTypeOf) {
    this.__field.isTypeOf = isTypeOf;
    return this;
  }

  end() {
    return new GraphQLObjectType(super());
  }
}

export default function objectType(...args) {
  return new Obj(...args);
}
