import _ from 'lodash'
import glob from 'glob'

const rootPermissions = {
  Query: {},
  Mutation: {},
}

const mongoPermission = require(`${__dirname}/database/mongo/permissions.js`)
const autoPermissions = glob.sync(`${__dirname}/domain/*/permissions.js`).map(path => require(path))

module.exports = _.merge({}, rootPermissions, mongoPermission, ...autoPermissions)
