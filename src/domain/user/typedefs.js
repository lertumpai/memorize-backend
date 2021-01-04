import { gql } from 'apollo-server-express'

const typeDefs = gql`
  extend type Query {
    user(id: MID, username: String): User
    login(username: String, password: String) : User
  }
  extend type Mutation {
    user(username: String, password: String) : User
    profile(id: MID!, input: ProfileInput) : User
  }
  type User {
    id: MID!
    active: Boolean!
    token: String!
    profile: ProfileUser
  }
  type ProfileUser {
    name: String
    birthday: Date
    status: String
    image: String
  }
  input ProfileInput {
    name: String
    birthday: Date
    status: String
    image: String
  }
`

module.exports = typeDefs
