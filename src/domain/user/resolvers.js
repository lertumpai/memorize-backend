module.exports = {
  Query: {
    async user(obj, { id, username }, { User }) {
      return id ? await User.findById(id) : await User.findByUsername(username)
    },
  },
  Mutation: {
    async register(_, { username, password }, context) {
      const { register, User } = context
      const user = await register({ username, password }, { User })
      return user
    }
  },
}