import { expect, assert } from 'chai'
import mongoose from 'mongoose'

import {
  User,
} from '../../../../src/database/mongo'
import { utils } from '../../../utils/api'

describe('src/database/mongo/user/User.js', () => {
  beforeEach(async () => {
    await utils.mongo.clearAll()
  })

  describe('create', () => {
    it('should create new user', async () => {
      const { username, password } = utils.users.users.userA
      const newUser = await User.create({
        username,
        password,
      })
      assert.isString(newUser.id, 'newUser.id')
      expect(newUser.username).equal(username)
      expect(newUser.password).equal(password)
      assert.isTrue(newUser.active, 'newUser.active')
      assert.isObject(newUser.profile, 'newUser.profile')
      assert.isNotNull(newUser.createdAt, 'newUser.createdAt')
      assert.isNotNull(newUser.updatedAt, 'newUser.updatedAt')
      assert.isUndefined(newUser.deletedAt, 'newUser.deletedAt')
    })
  })

  describe('findByUsername', () => {
    it('should return user when username exists', async () => {
      await utils.users.createUserA()
      const user = await User.findByUsername(utils.users.users.userA.username)
      assert.isObject(user, 'user')
      expect(user.username).equal(utils.users.users.userA.username)
    })

    it('should not return user when username not exists', async () => {
      const user = await User.findByUsername('AAA')
      assert.isNull(user, 'user')
    })
  })

  describe('updateProfile', () => {
    it('should update user profile when user exists', async () => {
      const createdUser = await utils.users.createUserA()
      const updatedUser = await User.updateProfile(createdUser.id, utils.users.users.userA.profile)

      const { name, birthday, image, status } = utils.users.users.userA.profile
      expect(updatedUser.profile.name).equal(name)
      expect(updatedUser.profile.birthday).equal(birthday)
      expect(updatedUser.profile.status).equal(status)
      expect(updatedUser.profile.image.toString()).equal(image.id.toString())
    })

    it('should not update user profile when not input profile', async () => {
      const createdUser = await utils.users.createUserA()
      const updatedUser_1 = await User.updateProfile(createdUser.id, utils.users.users.userA.profile)
      const updatedUser_2 = await User.updateProfile(createdUser.id, {})

      expect(updatedUser_1.profile.name).equal(updatedUser_2.profile.name)
      expect(updatedUser_1.profile.birthday.toString()).equal(updatedUser_2.profile.birthday.toString())
      expect(updatedUser_1.profile.status).equal(updatedUser_2.profile.status)
      expect(updatedUser_1.profile.image.toString()).equal(updatedUser_2.profile.image.toString())
    })

    it('should throw NOT_FOUND_ERROR when user not exists', async () => {
      try {
        await User.updateProfile(mongoose.Types.ObjectId(), utils.users.users.userA.profile)
      } catch(e) {
        expect(e.name).equal('NOT_FOUND_ERROR')
        expect(e.message.user).equal('user is not found')
      }
    })
  })
})


