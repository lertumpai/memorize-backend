import * as Authentication from '../../authentication'

module.exports = {
  Query: {
    async user(_, { id, username }, { User }) {
      return id ? await User.findById(id) : await User.findByUsername(username)
    },
    login(_, { username, password }, { User }) {
      return Authentication.login({ username, password }, { User })
    },
  },
  Mutation: {
    async register(_, { username, password }, { User }) {
      return Authentication.register({ username, password }, { User })
    }
  },
}