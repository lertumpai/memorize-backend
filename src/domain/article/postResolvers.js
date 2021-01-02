module.exports = {
  Mutation: {
    article(_, args, { io }) {
      return io.emit('CREATED_ARTICLE', 'CREATED_ARTICLE')
    },
  },
}
