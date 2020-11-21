import { auth } from './utils/auth'

module.exports = {
  Mutation: {
    profile(_, { id }, { user }) {
      auth({ id, user })
    },
  },
}
