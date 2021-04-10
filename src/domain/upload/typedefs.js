import { gql } from 'apollo-server-express'

const typeDefs = gql`
  input ImageInput {
    destination: String
    fileName: String
    uploadPath: String
  }

  extend type Mutation {
    uploadImage(file: Upload!, path: String!): String
  }

  type File {
    filename: String!
    mimetype: String!
    encoding: String!
  }
`

module.exports = typeDefs
