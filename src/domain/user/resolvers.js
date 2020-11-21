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
    register(_, { username, password }, { User }) {
      return Authentication.register({ username, password }, { User })
    },
    async profile(_, { id, profile }, { User, date }) {
      return User.updateProfile(id, {
        name: profile.name,
        status: profile.status,
        birthday: profile.birthday,
        date
      })
    }
  },
  User: {
    token(user) {
      return user ? token({ userId: user.id, username: user.username, profile: user.profile }) : null
    }
  }
}