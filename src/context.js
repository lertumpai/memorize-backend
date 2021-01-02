import glob from 'glob'
import moment from 'moment'

import { verifyToken } from './authentication/token'


function wrapMongoDBModel() {
  return glob.sync(`${__dirname}/database/mongo/*/index.js`).reduce((result, path) => ({ ...result, ...require(path) }), {})
}

export async function context({ req }) {
  const models = wrapMongoDBModel()
  const date = moment.utc().toDate()

  return {
    user: verifyToken(req.headers.authorization, date),
    date,
    ...models,
    io: req.io,
  }
}

module.exports = context
