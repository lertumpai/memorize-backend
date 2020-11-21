import _ from 'lodash'
import glob from 'glob'

import pkg from '../package'

const rootResolvers = {
  Query: {
    version: () => {
      return pkg.version
    },
  },
  Mutation: {
    version: () => {
      return pkg.version
    },
  }
}

const autoResolvers = glob.sync(`${__dirname}/domain/*/resolvers.js`).map(path => require(path))

module.exports = _.merge({}, rootResolvers, ...autoResolvers)
