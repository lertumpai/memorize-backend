module.exports = {
  Query: {
    article(_, { id }, { Article }) {
      return Article.findById(id)
    },
  },
  Mutation: {
    article(_, { id, input }, { Article, user, date }) {
      const { content } = input
      return id
        ? Article.update(id, { content, date })
        : Article.create({ author: user.userId, content, date })
    },
    articleDelete(_, { id }, { Article }) {
      return Article.deleteById(id)
    },
  },
}