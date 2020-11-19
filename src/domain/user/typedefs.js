import { gql } from 'apollo-server-express'

const typeDefs = gql`
  extend type Query {
    "user"
    user(id: ID, username: String): User
  },
  extend type Mutation {
    register(username: String, password: String) : User
  },
  type User {
    "id"
    id: ID,
    "name"
    name: String,
  }
`

module.exports = typeDefs
