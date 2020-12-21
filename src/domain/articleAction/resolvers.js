module.exports = {
  Mutation: {
    articleAction(_, { articleId, action }, { ArticleAction, user }) {
      return ArticleAction.update({ authorId: user.id, articleId, action })
    },
  },
}
