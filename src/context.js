import moment from 'moment'

import { verifyToken } from './authentication/token'

export async function context({ req }) {
  const date = moment.utc().toDate()

  return {
    user: verifyToken(req.headers.authorization, date),
    date,
    io: req.io,
  }
}

module.exports = context
