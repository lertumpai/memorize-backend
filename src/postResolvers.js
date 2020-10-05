import _ from 'lodash'
import glob from 'glob'

const rootPostResolvers = {
  Query: {},
  Mutation: {}
}

const autoPostResolvers = glob.sync(`${__dirname}/domain/*/postResolvers.js`).map(path => require(path))

module.exports = _.merge({}, rootPostResolvers, ...autoPostResolvers)
