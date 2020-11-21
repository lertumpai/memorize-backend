import { gql } from 'apollo-server-express'

const typeDefs = gql`
  extend type Query {
    user(id: ID, username: String): User,
    login(username: String, password: String) : User
  }
  extend type Mutation {
    register(username: String, password: String) : User
    profile(profile: Profile) : User
  }
  type User {
    id: ID,
    token: String,
    profle: UserProfile
  }
  type UserProfile {
    name: String,
    birthday: String,
    status: String
  }
  input Profile {
    name: String,
    birthday: String,
    status: String
  }
`

module.exports = typeDefs
