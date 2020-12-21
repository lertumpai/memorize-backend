import { gql } from 'apollo-server-express'

const typeDefs = gql`
  extend type Mutation {
    articleAction(articleId: MID!, action: ArticleActionEnum!): ArticleAction
  }
  type ArticleAction {
    article: Article!
    author: User!
    action: ArticleActionEnum!
  }
  enum ArticleActionEnum {
    like
    unlike
  }
`

module.exports = typeDefs
