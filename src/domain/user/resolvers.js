module.exports = {
  Query: {
    async user(obj, { id, username }, { User }) {
      return id ? await User.findById(id) : await User.findByUsername(username)
    },
    login(obj, { username, password }, { login: _login, User }) {
      return _login({ username, password }, { User })
    },
  },
  Mutation: {
    async register(_, { username, password }, context) {
      const { register: _register, User } = context
      const user = await _register({ username, password }, { User })
      return user
    }
  },
}