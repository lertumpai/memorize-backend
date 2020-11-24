import { gql } from 'apollo-server-express'

const typeDefs = gql`
  extend type Query {
    article(id: MID!): Article
    articles(author: MID, pagination: Pagination = {}): [Article]
  }
  extend type Mutation {
    article(id: MID, input: ArticleInput!): Article
    articleDelete(id: MID!): Article
  }
  type Article {
    id: MID!
    author: User!
    content: String!
    active: Boolean!
    createdAt: Date
    updatedAt: Date
    deletedAt: Date
  }
  input ArticleInput {
    content: String!
  }
`

module.exports = typeDefs
