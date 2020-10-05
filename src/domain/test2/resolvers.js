const resolvers = {
  Query: {
    sum(obj, {x, y}) {
      return x + y
    },
  },
  Mutation: {
    multiple: ({x, y}) => x * y
  }
}

module.exports = resolvers
