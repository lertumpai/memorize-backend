import { NOT_FOUND_ERROR } from '../../error'

module.exports = {
  Mutation: {
    async articleAction(_, { id }, { Article }) {
      const article = await Article.findById(id)

      if(!article) {
        throw new NOT_FOUND_ERROR('article')
      }
    },
    async commentAction(_, { id }, { Comment }) {
      const comment = await Comment.findById(id)

      if(!comment) {
        throw new NOT_FOUND_ERROR('comment')
      }
    },
  },
}
