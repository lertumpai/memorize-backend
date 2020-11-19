import { gql } from 'apollo-server-express'

const typeDefs = gql`
  extend type Query {
    hello: String
  },
`

module.exports = typeDefs
