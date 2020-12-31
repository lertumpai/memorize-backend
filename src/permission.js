import _ from 'lodash'
import glob from 'glob'
import bcrypt from 'bcrypt'
import { UNAUTHORIZED_ERROR } from './error'

const rootPermissions = {
  Query: {
    env: (_, { key }) => {
      if (!bcrypt.compareSync(key, process.env.PRIVATE_HASH_KEY)) {
        throw new UNAUTHORIZED_ERROR()
      }
    },
  },
  Mutation: {},
}

const mongoPermission = require(`${__dirname}/database/mongo/permissions.js`)
const autoPermissions = glob.sync(`${__dirname}/domain/*/permissions.js`).map(path => require(path))

module.exports = _.merge({}, rootPermissions, mongoPermission, ...autoPermissions)
