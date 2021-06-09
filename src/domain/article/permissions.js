import { authArticle } from './utils/auth'

module.exports = {
  Mutation: {
    article(_, { id }, { user }) {
      if (id) {
        return authArticle(id, user)
      }
    },
    articleDelete(_, { id }, { user }) {
      return authArticle(id, user)
    },
  },
}
