module.exports = {
  Mutation: {
    commentAction(_, { commentId, action }, { CommentAction, user }) {
      return CommentAction.update({ authorId: user.id, commentId, action })
    },
  },
}
