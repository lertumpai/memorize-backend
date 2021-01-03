import { ARTICLE_UPDATED } from '../article/utils/enum'
import { COMMENT_UPDATED } from './utils/enum'

module.exports = {
  Mutation: {
    comment(_, args, { io }, info, res) {
      return Promise.all([
        io.emit(ARTICLE_UPDATED, res.articleId),
        io.emit(COMMENT_UPDATED, res.id),
      ])
    },
    commentDelete(_, args, { io }, info, res) {
      return Promise.all([
        io.emit(ARTICLE_UPDATED, res.articleId),
        io.emit(COMMENT_UPDATED, res.id),
      ])
    },
    articleDelete(_, { id }, { Comment }) {
      return Comment.deleteByArticle(id)
    },
  },
}
