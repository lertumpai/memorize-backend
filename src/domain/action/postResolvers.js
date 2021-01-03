import { ARTICLE_UPDATED } from '../article/utils/enum'
import { COMMENT_UPDATED } from '../comment/utils/enum'

module.exports = {
  Mutation: {
    articleAction(_, { id }, { io }) {
      return io.emit(ARTICLE_UPDATED, id)
    },
    commentAction(_, { id }, { io }) {
      return io.emit(COMMENT_UPDATED, id)
    },
  },
}
