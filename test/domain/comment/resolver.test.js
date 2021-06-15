import sinon from 'sinon'
import { assert, expect } from 'chai'
import { gql } from 'apollo-server-express'

import { requestMutation, requestQuery } from '../../server'
import { ArticleFragment } from '../../utils/gql/article'
import { utils } from '../../utils/api'
import * as upload from '../../../src/domain/upload/utils/upload'

describe('src/domain/comment/resolvers.js', () => {
  beforeEach(async () => {
    await utils.mongo.clearAll()
  })

  afterEach(() => {
    sinon.restore()
  })

  describe('query', () => {

  })

  describe('mutation', () => {

  })
})


