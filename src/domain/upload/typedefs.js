import { gql } from 'apollo-server-express'

const typeDefs = gql`
  input ImageInput {
    destination: String
    fileName: String
    uploadPath: String
  }
`

module.exports = typeDefs
