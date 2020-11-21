import _ from 'lodash'
import glob from 'glob'
import { gql } from 'apollo-server-express'

const rootTypeDefs = gql`
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

const autoTypeDefs = glob.sync(`${__dirname}/domain/*/typedefs.js`).map(path => require(path))
module.exports = [rootTypeDefs, ...autoTypeDefs]
