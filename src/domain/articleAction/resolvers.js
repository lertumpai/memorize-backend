module.exports = {
  Mutation: {
    articleAction(_, { articleId, action }, { ArticleAction, user }) {
      return ArticleAction.update({ author: user.userId, articleId, action })
    },
  },
}
