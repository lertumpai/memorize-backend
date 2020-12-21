module.exports = {
  Mutation: {
    articleAction(_, { articleId, action }, { ArticleAction, user }) {
      return ArticleAction.update({ author: user.userId, articleId, action })
    },
  },
  ArticleAction: {
    article({ articleId }, _, { Article }) {
      return Article.findById(articleId)
    },
    author({ author }, _, { User }) {
      return User.findById(author)
    },
  },
}
