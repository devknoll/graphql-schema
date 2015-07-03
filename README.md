graphql-schema
==============

Create GraphQL schemas with ES7 classes and decorators

## Installation

    npm install graphql-schema

## Usage

```js
@object('RootQueryType', `TODO: Description`)
class RootQueryType {
  @field(GraphQLString, `Say hello to someone`)
  @arg('name', GraphQLString, `The name of the person to say hello to`)
  hello(root, {name}) {
    return `Hello, ${name}`;
  }
}
```

becomes

```js
var RootQueryType = new GraphQLObjectType({
  name: 'RootQueryType',
  description: 'TODO: Description'
  fields: {
    hello: {
      type: GraphQLString,
      description: 'Say Hello to someone',
      args: {
        name: {
          name: 'name',
          type: GraphQLString,
          description: 'The name of the person to say Hello to'
        }
      }
      resolve: (root, {name}) => `Hello, ${name}`;
    }
  }
});
```

## Example

```js
import { graphql, GraphQLSchema, GraphQLString } from 'graphql-schema';
import { object, field, arg } from 'graphql-schema';

@object('RootQueryType', `TODO: Description`)
class RootQueryType {
  @field(GraphQLString, `Say Hello to someone`)
  @arg(GraphQLString, 'name', `The name of the person to say Hello to`)
  hello(root, {name}) {
    return `Hello, ${name}`;
  }
}

const schema = new GraphQLSchema({
  query: RootQueryType
});

graphql(schema, '{ hello(name: "Mark") }').then(result => {
  console.log(JSON.stringify(result)); // "Hello, Mark"
});
```

## Class Decorators

### object(name, description = null)

## Method Decorators

### field(type, description = null)

### arg(name, type, description = null)

### deprecated(reason)

## TODO

* Interfaces, enums, deprecation
* Bind functions to `root`
* Default types to NotNull and require a `nullable()` wrapper?