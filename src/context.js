import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
dayjs.extend(utc)

import { verifyToken } from './authentication/token'

export async function context({ req }) {
  const date = dayjs.utc().toDate()

  return {
    user: verifyToken(req.headers.authorization, date),
    date,
    io: req.io,
  }
}

module.exports = context
