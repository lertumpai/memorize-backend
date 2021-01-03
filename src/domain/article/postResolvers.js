import { ARTICLE_UPDATED } from './utils/enum'

module.exports = {
  Mutation: {
    article(_, args, { io }, info, res) {
      return io.emit(ARTICLE_UPDATED, res.id)
    },
    articleDelete(_, args, { io }, info, res) {
      return io.emit(ARTICLE_UPDATED, res.id)
    },
  },
}
