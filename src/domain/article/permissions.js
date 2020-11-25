import { auth } from './utils/auth'

module.exports = {
  Mutation: {
    article(_, { id }, { Article, user }) {
      if (id) {
        return auth({ id }, { Article, user })
      }
    },
    articleDelete(_, { id }, { Article, user }) {
      return auth({ id }, { Article, user })
    },
  },
}
