module.exports = {
  Mutation: {
    article(_, args, { io }) {
      return io.emit('ARTICLE_CREATED', 'ARTICLE_CREATED')
    },
  },
}
