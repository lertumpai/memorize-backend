import { authUser } from './utils/auth'

module.exports = {
  Mutation: {
    profile(_, { id }, { user }) {
      return authUser(id, user)
    },
  },
}
