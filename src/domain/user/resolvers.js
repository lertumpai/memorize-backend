import * as Authentication from '../../authentication'
import { token } from '../../authentication/token'

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
  User: {
    token(user) {
      return user ? token({ userId: user.id, username: user.username, profile: user.profile }) : null
    }
  }
}