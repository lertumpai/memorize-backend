import { gql } from 'apollo-server-express'

const typeDefs = gql`
  extend type Query {
    article(id: MID!): Article
    articles(author: MID, pagination: Pagination = {}): FeedArticle!
  }
  extend type Mutation {
    article(id: MID, input: ArticleInput!): Article
    articleDelete(id: MID!): Article
  }
  type FeedArticle {
    data: [Article]
    hasMore: Boolean!
  }
  type Article {
    id: MID!
    author: User!
    content: String!
    image: String
    active: Boolean!
    userAction: Action
    action: String!
    comment: String!
    canMutate: Boolean!
    createdAt: Date
    updatedAt: Date
    deletedAt: Date
  }
  input ArticleInput {
    content: String!
    image: ImageInput
  }
`

module.exports = typeDefs
