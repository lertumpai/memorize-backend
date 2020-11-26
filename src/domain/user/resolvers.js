import * as Authentication from '../../authentication'
import { token } from '../../authentication/token'

module.exports = {
  Query: {
    user(_, { id, username }, { User }) {
      return id ? User.findById(id) : User.findByUsername(username)
    },
    login(_, { username, password }, { User }) {
      return Authentication.login({ username, password }, { User })
    },
  },
  Mutation: {
    user(_, { username, password }, { User, date }) {
      return Authentication.register({ username, password }, { User, date })
    },
    profile(_, { id, input }, { User, date }) {
      return User.updateProfile(id, {
        name: input.name,
        status: input.status,
        birthday: input.birthday,
        date,
      })
    },
  },
  User: {
    token(user) {
      return token(user)
    },
  },
}