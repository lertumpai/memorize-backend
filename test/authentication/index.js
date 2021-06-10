import { expect } from 'chai'

import { register, login } from '../../src/authentication'
import { utils } from '../utils/api'

describe('index', () => {
  beforeEach(async () => {
    await utils.mongo.clearAll()
  })

  describe('register', () => {
    it('should register success', async () => {
      const user = {
        username: utils.randomString(15),
        password: utils.randomString(10),
      }
      const createdUser = await register(user, { date: utils.now() })
      expect(createdUser.username).equal(user.username)
    })

    it('should throw DUPLICATED_VALUE_ERROR when register exists username', async () => {
      const user = {
        username: utils.randomString(15),
        password: utils.randomString(10),
      }
      try {
        await register(user, { date: utils.now() })
        await register(user, { date: utils.now() })
      } catch(e) {
        expect(e.name).equal('DUPLICATED_VALUE_ERROR')
        expect(e.message.username).equal('username is duplicated')
      }
    })

    it('should throw REGISTER_FAIL_ERROR when username = null', async () => {
      try {
        await register({
          password: utils.randomString(5),
        }, {
          date: utils.now(),
        })
      } catch(e) {
        expect(e.name).equal('REGISTER_FAIL_ERROR')
        expect(e.message.username).equal('username is invalid')
        expect(e.message.password).equal(undefined)
      }
    })

    it('should throw REGISTER_FAIL_ERROR when password = null', async () => {
      try {
        await register({
          username: utils.randomString(5),
        }, {
          date: utils.now(),
        })
      } catch(e) {
        expect(e.name).equal('REGISTER_FAIL_ERROR')
        expect(e.message.username).equal(undefined)
        expect(e.message.password).equal('password is invalid')
      }
    })
  })

  describe('login', () => {
    beforeEach(async () => {
      await utils.users.createUserA()
    })

    it('should login success', async () => {
      const user = await login({
        username: utils.users.users.userA.username,
        password: utils.users.users.userA.password,
      })
      expect(user.username).equal(utils.users.users.userA.username)
    })

    it('should throw LOGIN_FAIL_ERROR when username = null', async () => {
      try {
        await login({
          password: utils.randomString(5),
        })
      } catch(e) {
        expect(e.name).equal('LOGIN_FAIL_ERROR')
        expect(e.message.username).equal('username is invalid')
        expect(e.message.password).equal(undefined)
      }
    })

    it('should throw LOGIN_FAIL_ERROR when password = null', async () => {
      try {
        await login({
          username: utils.randomString(5),
        })
      } catch(e) {
        expect(e.name).equal('LOGIN_FAIL_ERROR')
        expect(e.message.username).equal(undefined)
        expect(e.message.password).equal('password is invalid')
      }
    })

    it('should throw NOT_FOUND_ERROR when login with username doesnt exist', async () => {
      try {
        await login({
          username: utils.randomString(5),
          password: utils.randomString(5),
        })
      } catch(e) {
        expect(e.name).equal('NOT_FOUND_ERROR')
        expect(e.message.username).equal('username is not found')
      }
    })
  })
})


