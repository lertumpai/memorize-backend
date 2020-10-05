const resolvers = {
  Query: {
    hello: () => {
      console.log('post resolver')
      return 'post Hello world!'
    },
  },
}

module.exports = resolvers
