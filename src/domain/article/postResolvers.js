module.exports = {
  Mutation: {
    article(_, args, { io }, info, res) {
      return io.emit('ARTICLE_CREATED', res.id)
    },
  },
}
