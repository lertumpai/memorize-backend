const resolvers = {
  Query: {
    sum: ({x, y}) => x + y,
  },
  Mutation: {
    multiple: ({x, y}) => x * y
  }
}

module.exports = resolvers
