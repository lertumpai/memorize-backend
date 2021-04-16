import moment from 'moment'

import { verifyToken } from './authentication/token'
import { wrapMongoDBModel } from './database/mongo'

export async function context({ req }) {
  const models = await wrapMongoDBModel()
  const date = moment.utc().toDate()

  return {
    user: verifyToken(req.headers.authorization, date),
    date,
    ...models,
    io: req.io,
  }
}

module.exports = context
