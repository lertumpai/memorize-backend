import nFormatter from '../../utils/nFormatter'

module.exports = {
  Query: {
    article(_, { id }, { Article }) {
      return Article.findById(id)
    },
    async articles(_, { author, pagination }, { Article }) {
      return Article.findAll({ author }, pagination)
    },
  },
  Mutation: {
    article(_, { id, input }, { Article, user, date }) {
      const { content } = input
      return id ? Article.update(id, { content, date }) : Article.create({ author: user.id, content, date })
    },
    articleDelete(_, { id }, { Article, date }) {
      return Article.deleteById(id, { date })
    },
  },
  Article: {
    author({ author }, _, { User }) {
      return User.findById(author)
    },
    async comment({ id }, _, { Comment }) {
      const commentCount = await Comment.count({ articleId: id })
      return nFormatter(commentCount)
    },
    async action({ id }, _, { ArticleAction }) {
      const articleActionCount = await ArticleAction.count({ articleId: id })
      return nFormatter(articleActionCount)
    },
    userAction({ id }, _, { ArticleAction, user }) {
      return ArticleAction.findOneByArticleAuthor({ articleId: id, authorId: user.id })
    },
  },
}
