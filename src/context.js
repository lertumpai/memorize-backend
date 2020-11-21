import glob from 'glob'
import moment from 'moment'

import { verifyToken } from './authentication/token'


function wrapMongoDBModel() {
  return glob.sync(`${__dirname}/database/mongo/*/index.js`).reduce((result, path) => ({ ...result, ...require(path) }), {})
}

export async function context({ req }) {
  const user = verifyToken(req.headers.authentication)
  const models = wrapMongoDBModel()

  return {
    user,
    date: moment.utc(),
    ...models
  }
}

module.exports = context