module.exports = {
  Query: {
    article(_, { id }, { Article }) {
      return Article.findById(id)
    },
    articles(_, { author, pagination }, { Article }) {
      return Article.findAll({ author }, pagination)
    },
  },
  Mutation: {
    article(_, { id, input }, { Article, user, date }) {
      const { content } = input
      return id
        ? Article.update(id, { content, date })
        : Article.create({ author: user.userId, content, date })
    },
    articleDelete(_, { id }, { Article, date }) {
      return Article.deleteById(id, { date })
    },
  },
  Article: {
    author({ author }, _, { User }) {
      return User.findById(author)
    },
  },
}