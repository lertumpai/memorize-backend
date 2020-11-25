import { gql } from 'apollo-server-express'

const typeDefs = gql`
  extend type Query {
    comment(id: MID!): Comment
    comments(article: MID!, pagination: Pagination = {}): [Comment]
  }
  extend type Mutation {
    comment(id: MID, input: CommentInput!): Comment
    commentDelete(id: MID!): Comment
  }
  type Comment {
    id: MID!
    author: User!
    article: Article!
    content: String!
    active: Boolean!
    createdAt: Date
    updatedAt: Date
    deletedAt: Date
  }
  input CommentInput {
    content: String!
    article: MID!
  }
`

module.exports = typeDefs
