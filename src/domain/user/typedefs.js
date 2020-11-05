import {gql} from 'apollo-server-express'

const typeDefs = gql`
  extend type Query {
    "user"
    user(id: ID): User
  },
  type User {
    "id"
    id: ID,
    "name"
    name: String,
  }
`

module.exports = typeDefs
