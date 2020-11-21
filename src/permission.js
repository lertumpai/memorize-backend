import _ from 'lodash'
import glob from 'glob'

const rootPermissions = {
  Query: {},
  Mutation: {},
}

const autoPermissions = glob.sync(`${__dirname}/domain/*/permission.js`).map(path => require(path))

module.exports = _.merge({}, rootPermissions, ...autoPermissions)
