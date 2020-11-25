import { auth } from './utils/auth'

module.exports = {
  Mutation: {
    async profile(_, { id }, { User, user }) {
      await auth({ id, user }, { User })
    },
  },
}
