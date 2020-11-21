import moment from 'moment'
import _ from 'lodash'
import glob from 'glob'
import { GraphQLScalarType } from 'graphql'

import pkg from '../package'

function DateType() {
  const date = value => moment(value).utc().toDate()
  return {
    Date: new GraphQLScalarType({
      name: 'Date',
      description: 'Date custom scalar type',
      parseValue(value) {
        return date(value)
      },
      serialize(value) {
        return date(value)
      },
      parseLiteral({ value }) {
        return date(value)
      },
    }),
  }
}

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
  },
}

const autoResolvers = glob.sync(`${__dirname}/domain/*/resolvers.js`).map(path => require(path))

module.exports = _.merge(
  {},
  rootResolvers,
  ...autoResolvers,
  DateType(),
)
