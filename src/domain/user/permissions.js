import { auth } from './utils/auth'

module.exports = {
  Mutation: {
    profile(_, { id }, { User, user }) {
      return auth({ id }, { User, user })
    },
  },
}
