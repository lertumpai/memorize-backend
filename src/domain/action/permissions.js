import { NOT_FOUND_ERROR } from '../../error'

module.exports = {
  Mutation: {
    async articleAction(_, { articleId }, { Article }) {
      const article = await Article.findById(articleId)

      if(!article) {
        throw new NOT_FOUND_ERROR('article')
      }
    },
    async commentAction(_, { commentId }, { Comment }) {
      const comment = await Comment.findById(commentId)

      if(!comment) {
        throw new NOT_FOUND_ERROR('comment')
      }
    },
  },
}
