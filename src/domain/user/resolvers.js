import { User } from '../../database/mongo/user'
import * as Authentication from '../../authentication'

module.exports = {
  Query: {
    async user(_, { id, username }) {
      return id ? await User.findById(id) : await User.findByUsername(username)
    },
    login(_, { username, password }) {
      return Authentication.login({ username, password })
    },
  },
  Mutation: {
    async register(_, { username, password }) {
      const user = await Authentication.register({ username, password })
      return user
    }
  },
}