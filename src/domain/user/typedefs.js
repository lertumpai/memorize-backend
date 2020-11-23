import { gql } from 'apollo-server-express'

const typeDefs = gql`
  extend type Query {
    user(id: ID, username: String): User
    login(username: String, password: String) : User
  }
  extend type Mutation {
    user(username: String, password: String) : User
    profile(id: ID!, input: ProfileInput) : User
  }
  type User {
    id: ID!
    active: Boolean!
    token: String!
    profile: ProfileUser
  }
  type ProfileUser {
    name: String
    birthday: Date
    status: String
  }
  input ProfileInput {
    name: String
    birthday: Date
    status: String
  }
`

module.exports = typeDefs
