import { auth } from './utils/auth'
import { NOT_FOUND_ERROR } from '../../error'

module.exports = {
  Mutation: {
    async comment(_, { id, input: { articleId } }, { Article, Comment, user }) {
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
