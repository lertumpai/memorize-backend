module.exports = {
  Mutation: {
    articleAction(_, { articleId, action }, { ArticleAction, user }) {
      return ArticleAction.update({ authorId: user.id, articleId, action })
    },
    commentAction(_, { commentId, action }, { CommentAction, user }) {
      return CommentAction.update({ authorId: user.id, commentId, action })
    },
  },
  Action: {
    __resolveType({ articleId, commentId }){
      if (articleId) {
        return 'ArticleAction'
      }
      if (commentId) {
        return 'CommentAction'
      }

      return null
    },
  },
}
