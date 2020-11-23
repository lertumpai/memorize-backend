import { auth } from './utils/auth'

module.exports = {
  Mutation: {
    async profile(_, { id }, { user }, { User }) {
      await auth({ id, user }, { User })
    },
  },
}
