import _ from 'lodash'
import glob from 'glob'

const rootPostResolvers = {
  Query: {},
  Mutation: {},
}

const autoPostResolvers = glob.sync(`${__dirname}/domain/*/postResolvers.js`).map(path => {
  const domain = path.split('/')
  return { [domain[domain.length - 2]]: require(path) }
})

module.exports = _.merge({}, rootPostResolvers, ...autoPostResolvers)
