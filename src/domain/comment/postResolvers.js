module.exports = {
  Mutation: {
    articleDelete(_, { id }, { Comment }) {
      return Comment.deleteByArticle(id)
    },
  },
}
