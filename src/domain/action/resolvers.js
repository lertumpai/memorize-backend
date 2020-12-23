module.exports = {
  Mutation: {
    async articleAction(_, { articleId, action }, { ArticleAction, Article, user }) {
      await ArticleAction.update({ authorId: user.id, articleId, action })
      return Article.findById(articleId)
    },
    async commentAction(_, { commentId, action }, { CommentAction, Comment, user }) {
      await CommentAction.update({ authorId: user.id, commentId, action })
      return Comment.findById(commentId)
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
