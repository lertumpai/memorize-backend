import sinon from 'sinon'
import { expect } from 'chai'
import { gql } from 'apollo-server-express'

import { request } from '../../server'
import { UserFragment } from '../../utils/gql/user'
import { utils } from '../../utils/api'

describe('src/domain/user/resolvers.js', () => {
  beforeEach(async () => {
    await utils.mongo.clearAll()
  })

  describe('query', () => {

  })

  describe('mutation', () => {
    describe('user', () => {
      const REGISTER = gql`
        mutation register($username: String!, $password: String!) {
          user(username: $username, password: $password) {
            ...UserFragment
          }
        }
        ${UserFragment}
      `

      it('should return version', async () => {
        const variables = {
          username: utils.randomString(5),
          password: utils.randomString(5),
        }
        const res = await request({ query: REGISTER, variables })
        console.log(res)
      })
    })
  })
})


