import { gql } from 'apollo-server-express'

const typeDefs = gql`
  extend type Mutation {
    articleAction(articleId: MID!, action: ArticleActionEnum!): ArticleAction
  }
  type ArticleAction {
    articleId: MID!
    authorId: MID!
    action: ArticleActionEnum!
  }
  enum ArticleActionEnum {
    like
    unlike
  }
`

module.exports = typeDefs
