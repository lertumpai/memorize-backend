const resolvers = {
  Query: {
    sum(obj, {x, y}) {
      return x + y
    },
  },
  Mutation: {
    multiple(obj, {x, y}) {
      return x * y
    }
  }
}

module.exports = resolvers
