import {gql} from 'apollo-server-express'

const typeDefs = gql`
  extend type Query {
    user(id: ID): User
  },
  type User {
    id: ID,
    name: String,
  }
`

module.exports = typeDefs
