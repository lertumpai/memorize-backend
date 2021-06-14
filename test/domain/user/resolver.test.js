import sinon from 'sinon'
import { assert, expect } from 'chai'
import { gql } from 'apollo-server-express'

import { requestMutation, requestQuery } from '../../server'
import { UserFragment } from '../../utils/gql/user'
import { utils } from '../../utils/api'
import { UploadProfile } from '../../../src/database/mongo'
import * as upload from '../../../src/domain/upload/utils/upload'

describe('src/domain/user/resolvers.js', () => {
  beforeEach(async () => {
    await utils.mongo.clearAll()
  })

  describe('query', () => {
    describe('user', () => {
      let userA
      beforeEach(async () => {
        userA = await utils.users.createUserA()
      })

      const USER = gql`
        query user($id: MID, $username: String) {
          user(id: $id, username: $username) {
            ...UserFragment
          }
        }
        ${UserFragment}
      `

      it('should return user by id', async () => {
        const { user } = await requestQuery({ schema: USER, variables: { id: userA.id } }, { context: userA.context })
        assert.isString(user.id, 'user.id')
        assert.isString(user.token, 'user.token')
        assert.isObject(user.profile, 'user.profile')
      })

      it('should return user by username', async () => {
        const { user } = await requestQuery({ schema: USER, variables: { username: userA.username } }, { context: userA.context })
        assert.isString(user.id, 'user.id')
        assert.isString(user.token, 'user.token')
        assert.isObject(user.profile, 'user.profile')
      })
    })

    describe('login', () => {
      let userA
      beforeEach(async () => {
        userA = await utils.users.createUserA()
      })

      const LOGIN = gql`
        query login($username: String!, $password: String!) {
          login(username: $username, password: $password) {
            ...UserFragment
          }
        }
        ${UserFragment}
      `

      it('should return user and token if login success', async () => {
        const variables = {
          username: utils.users.users.userA.username,
          password: utils.users.users.userA.password,
        }
        const { login } = await requestQuery({ schema: LOGIN, variables }, { context: userA.context })
        assert.isString(login.id, 'user.id')
        assert.isString(login.token, 'user.token')
        assert.isObject(login.profile, 'user.profile')
      })
    })
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

      it('should return created user', async () => {
        const variables = {
          username: utils.randomString(5),
          password: utils.randomString(5),
        }
        const { user } = await requestMutation({ schema: REGISTER, variables }, {})
        assert.isString(user.id, 'user.id')
        assert.isString(user.token, 'user.token')
        assert.isObject(user.profile, 'user.profile')
      })
    })

    describe('profile', () => {
      const PROFILE = gql`
        mutation profile($id: MID!, $input: ProfileInput) {
          profile(id: $id, input: $input) {
            ...UserFragment
          }
        }
        ${UserFragment}
      `

      let userA
      beforeEach(async () => {
        userA = await utils.users.createUserA()
      })
      afterEach(() => {
        sinon.restore()
      })

      it('should update user with image', async () => {
        const variables = {
          id: userA.id,
          input: {
            name: utils.randomString(5),
            birthday: new Date(),
            status: utils.randomString(5),
            image: {
              destination: utils.randomString(5),
              fileName: utils.randomString(5),
            },
          },
        }
        sinon.stub(UploadProfile, 'findById').returns(variables.input.image)
        sinon.stub(upload, 'getImageUrl').returns('image')
        const { profile: { profile } } = await requestMutation({ schema: PROFILE, variables }, { context: userA.context })
        expect(profile.status).equal(variables.input.status)
        expect(profile.name).equal(variables.input.name)
        expect(profile.image).equal('image')
        expect(profile.birthday.toString()).equal(variables.input.birthday.toString())
      })

      it('should update user with invalid image', async () => {
        const variables = {
          id: userA.id,
          input: {
            name: utils.randomString(5),
            birthday: new Date(),
            status: utils.randomString(5),
            image: {
              destination: utils.randomString(5),
              fileName: utils.randomString(5),
            },
          },
        }
        sinon.stub(UploadProfile, 'findById').returns(null)
        const { profile: { profile } } = await requestMutation({ schema: PROFILE, variables }, { context: userA.context })
        expect(profile.status).equal(variables.input.status)
        expect(profile.name).equal(variables.input.name)
        expect(profile.image).equal(null)
        expect(profile.birthday.toString()).equal(variables.input.birthday.toString())
      })

      it('should update user without image', async () => {
        const variables = {
          id: userA.id,
          input: {
            name: utils.randomString(5),
            birthday: new Date(),
            status: utils.randomString(5),
          },
        }
        const { profile: { profile } } = await requestMutation({ schema: PROFILE, variables }, { context: userA.context })
        expect(profile.status).equal(variables.input.status)
        expect(profile.name).equal(variables.input.name)
        assert.isNull(profile.image)
        expect(profile.birthday.toString()).equal(variables.input.birthday.toString())
      })

      it('should throw NOT_FOUND_ERROR if update profile user not exists', async () => {
        const variables = {
          id: utils.mongo.objectId(),
          input: {
            name: utils.randomString(5),
            birthday: new Date(),
            status: utils.randomString(5),
          },
        }
        try {
          await requestMutation({ schema: PROFILE, variables }, { context: userA.context })
        } catch(e) {
          expect(e.extensions.exception.name).equal('NOT_FOUND_ERROR')
        }
      })

      describe('userB update profile userA', () => {
        let userB
        beforeEach(async () => {
          userB = await utils.users.createUserB()
        })

        it('should throw UNAUTHORIZED_ERROR', async () => {
          const variables = {
            id: userA.id,
            input: {
              name: utils.randomString(5),
              birthday: new Date(),
              status: utils.randomString(5),
            },
          }
          try {
            await requestMutation({ schema: PROFILE, variables }, { context: userB.context })
          } catch(e) {
            expect(e.extensions.exception.name).equal('UNAUTHORIZED_ERROR')
          }
        })
      })
    })
  })
})


