module.exports = {
  Query: {
    hello: () => {
      console.log('post resolver')
      return 'post Hello world!'
    },
    user: (obj, { id }) => {
      console.log(id, 'user in postResolver article')
      return 1
    }
  },
  Mutation: {
  }
}
