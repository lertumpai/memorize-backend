module.exports = {
  Query: {
    comment(_, { id }, { Comment }) {
      return Comment.findById(id)
    },
    comments(_, { articleId, pagination }, { Comment }) {
      return Comment.findAll({ articleId }, pagination)
    },
  },
  Mutation: {
    comment(_, { id, input }, { Comment, user, date }) {
      const { content, articleId } = input
      return id ? Comment.update(id, { content, date }) : Comment.create({ articleId, author: user.id, content, date })
    },
    commentDelete(_, { id }, { Comment, date }) {
      return Comment.deleteById(id, { date })
    },
  },
  Comment: {
    author({ author }, _, { User }) {
      return User.findById(author)
    },
    article({ articleId }, _, { Article }) {
      return Article.findById(articleId)
    },
  },
}
