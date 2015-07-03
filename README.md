graphql-schema
==============

Create GraphQL schemas with ES7 classes and decorators

## Installation

    npm install graphql-schema

## Example

```js
import { graphql, GraphQLSchema, GraphQLString } from 'graphql-schema';
import { type, description, listOf } from 'graphql-schema';

@type('RootQueryType')
class RootQueryType {
  @type(GraphQLString)
  @description(`hello field description`)
  hello() {
    return 'world';
  }
}
```

becomes

```js
var RootQueryType = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    hello: {
      type: GraphQLString,
      resolve: () => 'world'
    }
  }
});
```

## Helpers

### listOf(type)

```js
listOf(GraphQLString) => new GraphQLList(GraphQLString)
```

## TODO

* Field argument types & descriptions (```@arg('id', `The user ID to find`)```)
* More fluent interface? `@type(class)` becomes `@object(class)`, `@type(property)` becomes `@returns(property)`
* Support for interfaces and enums
* Default types to NotNull and require a `nullable()` wrapper?