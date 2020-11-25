module.exports = {
  Query: {
    comment(_, { id }, { Comment }) {
      return Comment.findById(id)
    },
    comments(_, { article, pagination }, { Comment }) {
      return Comment.findAll({ article }, pagination)
    },
  },
  Mutation: {
    comment(_, { id, input }, { Comment, user, date }) {
      const { content, article } = input
      return id ? Comment.update(id, { content, date }) : Comment.create({ article, author: user.userId, content, date })
    },
    commentDelete(_, { id }, { Comment, date }) {
      return Comment.deleteById(id, { date })
    },
  },
  Comment: {
    author({ author }, _, { User }) {
      return User.findById(author)
    },
    article({ article }, _, { Article }) {
      return Article.findById(article)
    },
  },
}