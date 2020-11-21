import { gql } from 'apollo-server-express'

const typeDefs = gql`
  extend type Query {
    user(id: ID, username: String): User
    login(username: String, password: String) : User
  }
  extend type Mutation {
    register(username: String, password: String) : User
    profile(id: ID!, profile: ProfileInput) : User
  }
  type User {
    id: ID
    token: String
    profile: UserProfile
  }
  type UserProfile {
    name: String
    birthday: String
    status: String
  }
  input ProfileInput {
    name: String
    birthday: String
    status: String
  }
`

module.exports = typeDefs
