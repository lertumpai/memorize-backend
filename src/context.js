import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
dayjs.extend(utc)

import { verifyToken } from './authentication/token'
import * as models from './database/mongo'

export async function context({ req }) {
  const date = dayjs.utc().toDate()
  await Promise.all(Object.values(models).map(model => model.clearAll()))

  return {
    user: verifyToken(req.headers.authorization, date),
    date,
    io: req.io,
  }
}

module.exports = context
