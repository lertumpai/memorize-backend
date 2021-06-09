import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
dayjs.extend(utc)

import { isValidObjectId } from 'mongoose'
import _ from 'lodash'
import glob from 'glob'
import { GraphQLScalarType } from 'graphql'

import pkg from '../package'
import { INVALID_MONGOID_ERROR } from './error'

function DateType() {
  const date = value => dayjs(value).utc().toDate()
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

function MongoObjectId() {
  const validateMongoId = value => { if (!isValidObjectId(value)) { throw new INVALID_MONGOID_ERROR() } return value }
  return {
    MID: new GraphQLScalarType({
      name: 'MID',
      description: 'Mongo object id',
      parseValue(value) {
        return validateMongoId(value)
      },
      serialize(value) {
        return validateMongoId(value)
      },
      parseLiteral({ value }) {
        return validateMongoId(value)
      },
    }),
  }
}

const rootResolvers = {
  Query: {
    version: () => {
      return pkg.version
    },
    env: () => {
      return [
        `NODE_ENV = ${process.env.NODE_ENV}`,
        `PRIVATE_KEY = ${process.env.PRIVATE_KEY}`,
        `PRIVATE_HASH_KEY = ${process.env.PRIVATE_HASH_KEY}`,
        `MONGO_URI = ${process.env.MONGO_URI}`,
      ]
    },
  },
  Mutation: {
    version: () => {
      return pkg.version
    },
  },
}

const mongoTypeResolver = require(`${__dirname}/database/mongo/resolvers.js`)
const autoResolvers = glob.sync(`${__dirname}/domain/*/resolvers.js`).map(path => require(path))

module.exports = _.merge(
  {},
  rootResolvers,
  mongoTypeResolver,
  ...autoResolvers,
  DateType(),
  MongoObjectId(),
)
