import { gql } from 'apollo-server-express'

const typeDefs = gql`
  extend type Mutation {
    articleAction(articleId: MID!, action: ActionEnum!): Action
    commentAction(commentId: MID!, action: ActionEnum!): Action
  }
  interface Action {
    authorId: MID!
    action: ActionEnum!
  }
  type ArticleAction {
    articleId: MID!
    authorId: MID!
    action: ActionEnum!
  }
  type CommentAction {
    commentId: MID!
    authorId: MID!
    action: ActionEnum!
  }
  enum ActionEnum {
    like
    unlike
  }
`

module.exports = typeDefs
