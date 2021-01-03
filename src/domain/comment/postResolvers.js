import { ARTICLE_UPDATED } from '../article/utils/enum'
import { COMMENT_UPDATED } from './utils/enum'

module.exports = {
  Mutation: {
    comment(_, { id }, { io }, info, res) {
      return Promise.all([
        io.emit(ARTICLE_UPDATED, res.articleId),
        io.emit(COMMENT_UPDATED, id),
      ])
    },
    commentDelete(_, { id }, { io }, info, res) {
      return Promise.all([
        io.emit(ARTICLE_UPDATED, res.articleId),
        io.emit(COMMENT_UPDATED, id),
      ])
    },
    articleDelete(_, { id }, { Comment }) {
      return Comment.deleteByArticle(id)
    },
  },
}
