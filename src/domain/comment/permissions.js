import { auth } from './utils/auth'
import { NOT_FOUND_ERROR } from '../../error'

module.exports = {
  Mutation: {
    // TODO: used directive to check id is have value
    async comment(_, { id, articleId }, { Article, Comment, user }) {
      const article = await Article.findById(articleId)
      if (!article) {
        throw new NOT_FOUND_ERROR('article')
      }

      if (id) {
        return auth({ id }, { Comment, user })
      }
    },
    commentDelete(_, { id }, { Comment, user }) {
      return auth({ id }, { Comment, user })
    },
  },
}
