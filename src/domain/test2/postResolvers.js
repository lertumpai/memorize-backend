const resolvers = {
  Query: {
    sum: ({x, y}) => {
      console.log(x + y + 1)
      return x + y + 1
    },
  },
  Mutation: {
    multiple: ({x, y}) => x * y
  }
}

module.exports = resolvers
