import { UNAUTHORIZED_ERROR } from '../../error'

module.exports = {
  Mutation: {
    syncMongoIndexes(_, { key }) {
      if (key === process.env.PRIVATE_HASH_KEY) {
        throw new UNAUTHORIZED_ERROR()
      }
    },
  },
}
