import { gql } from 'apollo-server-express'

const typeDefs = gql`
  extend type Mutation {
    commentAction(commentId: MID!, action: CommentActionEnum!): CommentAction
  }
  type CommentAction {
    commentId: MID!
    authorId: MID!
    action: CommentActionEnum!
  }
  enum CommentActionEnum {
    like
    unlike
  }
`

module.exports = typeDefs
