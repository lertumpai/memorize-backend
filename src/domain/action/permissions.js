import { NOT_FOUND_ERROR } from '../../error'

import {
  Article,
  Comment,
} from '../../database/mongo'

module.exports = {
  Mutation: {
    async articleAction(_, { id }) {
      const article = await Article.findById(id)

      if(!article) {
        throw new NOT_FOUND_ERROR('article')
      }
    },
    async commentAction(_, { id }) {
      const comment = await Comment.findById(id)

      if(!comment) {
        throw new NOT_FOUND_ERROR('comment')
      }
    },
  },
}
