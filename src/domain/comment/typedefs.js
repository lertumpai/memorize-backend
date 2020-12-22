import { gql } from 'apollo-server-express'

const typeDefs = gql`
  extend type Query {
    comment(id: MID!): Comment
    comments(articleId: MID!, pagination: Pagination = {}): [Comment]
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
    userAction: CommentAction
    action: String!
    canMutate: Boolean!
    createdAt: Date
    updatedAt: Date
    deletedAt: Date
  }
  input CommentInput {
    content: String!
    articleId: MID
  }
`

module.exports = typeDefs
