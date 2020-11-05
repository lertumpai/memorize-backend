const resolvers = {
  Query: {
    hello: () => {
      console.log('resolvers')
      return 'Hello world!'
    },
  },
}

module.exports = resolvers
