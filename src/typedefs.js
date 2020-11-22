import glob from 'glob'
import { gql } from 'apollo-server-express'

const rootTypeDefs = gql`
  scalar Date
  schema {
    query: Query
    mutation: Mutation
  },
  type Query {
    version: String!
  },
  type Mutation {
    version: String!
  }
`

const mongoTypeDef = require(`${__dirname}/database/mongo/typedefs.js`)
const autoTypeDefs = glob.sync(`${__dirname}/domain/*/typedefs.js`).map(path => require(path))

module.exports = [rootTypeDefs, mongoTypeDef, ...autoTypeDefs]
