import { gql } from 'apollo-server-express'

const typeDefs = gql`
  extend type Query {
    article(id: ID!): Article
    articles(author: ID, pagination: Pagination): [Article]
  }
  extend type Mutation {
    article(id: ID, input: ArticleInput!): Article
    articleDelete(id: ID!): Article
  }
  type Article {
    author: ID!
    content: String!
    active: Boolean!
    createdAt: Date
    updatedAt: Date
  }
  input ArticleInput {
    content: String!
  }
`

module.exports = typeDefs
