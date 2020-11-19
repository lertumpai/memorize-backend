import { gql } from 'apollo-server-express'

const typeDefs = gql`
  extend type Query {
    user(id: ID, username: String): User,
    login(username: String, password: String) : User
  },
  extend type Mutation {
    register(username: String, password: String) : User
  },
  type User {
    id: ID,
    token: String,
  }
`

module.exports = typeDefs
