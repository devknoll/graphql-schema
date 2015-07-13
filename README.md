graphql-schema
==============

Create GraphQL schemas with a fluent/chainable interface.

**Notice to <=0.3.0 users:**

The API has been changed significantly. Rather than hacking ES7 classes, `graphql-schema` now implements a fluent/chainable API. As a bonus, we can define entire schemas.

## Installation

    npm install graphql-schema

## Basic Usage

```js
const rootQueryType = objectType('RootQueryType', 'TODO: Description')
  .field('hello', GraphQLString, 'Say hello to someone')
    .arg('name', GraphQLString, 'The name of the person to say hello to')
    .resolve(root, {name} => `Hello, ${name}`)
  .end();
```

becomes

```js
var rootQueryType = new GraphQLObjectType({
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

## Full Example

```js
import { interfaceType, objectType, enumType, schemaFrom, listOf, notNull } from 'graphql-schema';

const episodeEnum = enumType('Episode',
    'One of the films in the Star Wars Trilogy')
  .value('NEWHOPE', 4, 'Released in 1977.')
  .value('EMPIRE', 5, 'Released in 1980.')
  .value('JEDI', 6, 'Released in 1983.')
  .end();

const characterInterface = interfaceType('Character',
    'A character in the Star Wars Trilogy')
  .field('id', notNull(GraphQLString), 'The id of the character.')
  .field('name', GraphQLString, 'The name of the character.')
  .field('friends', listOf(characterInterface),
    'The friends of the character, or an empty list if they have none')
  .field('appearsIn', listOf(episodeEnum), 'Which movies they appear in.')
  .resolve((obj) => {
    if (starWarsData.Humans[obj.id] !== undefined) {
      return humanType;
    }
    if (starWarsData.Droids[obj.id] !== undefined) {
      return droidType;
    }
    return null;
  })
  .end();

const humanType = objectType('Human', [characterInterface],
    'A humanoid creature in the Star Wars universe.')
  .field('id', notNull(GraphQLString), 'The id of the human.')
  .field('name', GraphQLString, 'The name of the human.')
  .field('friends', listOf(characterInterface),
    'The friends of the human, or an empty list if they have none', (human) => {
      return getFriends(human);
    })
  .field('appearsIn', listOf(episodeEnum), 'Which movies they appear in.')
  .field('homePlanet', GraphQLString,
    'The home planet of the human, or null if unknown.')
  .end();

const droidType = objectType('Droid', [characterInterface],
    'A mechanical creature in the Star Wars universe.')
  .field('id', notNull(GraphQLString), 'The id of the droid.')
  .field('name', GraphQLString, 'The name of the droid.')
  .field('friends', listOf(characterInterface),
    'The friends of the droid, or an empty list if they have none', (droid) => {
      return getFriends(droid);
    })
  .field('appearsIn', listOf(episodeEnum), 'Which movies they appear in.')
  .field('primaryFunction', GraphQLString, 'The primary function of the droid.')
  .end();

const queryType = objectType('Query')
  .field('hero', characterInterface, () => artoo)
  .field('human', humanType)
    .arg('id', notNull(GraphQLString))
    .resolve((root, {id}) => starWarsData.Humans[id])
  .field('droid', droidType)
    .arg('id', notNull(GraphQLString))
    .resolve((root, {id}) => starWarsData.Droids[id])
  .end();

const mutationType = objectType('Mutation')
  .field('updateCharacterName', characterInterface)
    .arg('id', notNull(GraphQLString))
    .arg('newName', notNull(GraphQLString))
    .resolve((root, {id, newName}) => updateCharacterName(id, newName))
  .end();

const starWarsSchema = schemaFrom(queryType, mutationType);
```

# Cyclic Types

`graphql-schema` supports cyclic types. Instead of passing in a reference, just pass in a function instead:

```js
const userType = objectType('User')
  .field('friends', () => listOf(userType))
  .end();
```

## API

### enumType(name, description)

Define a new `GraphQLEnumType`

##### .value(name, value, description)
##### .deprecated(deprecationReason)

### interfaceType(name, description)

Define a new `GraphQLInterfaceType`.

##### .field(name, type, description)
##### .deprecated(deprecationReason)
##### .arg(name, type, defaultValue, description)
##### .resolve(fn)

### objectType(name, [interfaces], description)

Define a new `GraphQLObjectType`.

##### .field(name, type, description)
##### .deprecated(deprecationReason)
##### .arg(name, type, defaultValue, description)
##### .resolve(fn)

## schemaFrom(queryRootType, mutationRootType)

Define a new `GraphQLSchema` from the given root types.

## listOf(type)

Define a new `GraphQLList(type)`.

## notNull(type)

Define a new `GraphQLNonNull(type)`.

# Thanks

Thanks to [Florent Cailhol](https://github.com/ooflorent) for the chainable interface idea!