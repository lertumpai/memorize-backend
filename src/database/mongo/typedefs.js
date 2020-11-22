import { gql } from 'apollo-server-express'

const typeDefs = gql`
  extend type Mutation {
    syncMongoIndexes(key: String!): String
  }
`

module.exports = typeDefs
