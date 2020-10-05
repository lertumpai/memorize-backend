const resolvers = {
  Query: {
    sum(obj, {x, y}) {
      return x + y + 1
    },
  },
  Mutation: {
    multiple: ({x, y}) => x * y
  }
}

module.exports = resolvers
