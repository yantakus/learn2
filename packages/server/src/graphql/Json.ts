import { GraphQLJSONObject } from 'graphql-type-json'
import { schema } from 'nexus'

schema.scalarType({
  name: 'JSON',
  serialize: GraphQLJSONObject.serialize,
  parseValue: GraphQLJSONObject.parseValue,
  parseLiteral: GraphQLJSONObject.parseLiteral,
})
