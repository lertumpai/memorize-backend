import { authComment } from './utils/auth'
import { NOT_FOUND_ERROR } from '../../error'

import {
  Article,
} from '../../database/mongo'

module.exports = {
  Mutation: {
    async comment(_, { id, input: { articleId } }, { user }) {
      if (id) {
        return authComment(id, user)
      }

      const article = await Article.findById(articleId)
      if (!article) {
        throw new NOT_FOUND_ERROR('article')
      }
    },
    commentDelete(_, { id }, { user }) {
      return authComment(id, user)
    },
  },
}
