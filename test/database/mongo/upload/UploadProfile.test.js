import { expect, assert } from 'chai'

import {
  UploadProfile,
} from '../../../../src/database/mongo'
import { utils } from '../../../utils/api'

describe('src/database/mongo/upload/UploadProfile.js', () => {
  let userA
  beforeEach(async () => {
    await utils.mongo.clearAll()
    userA = await utils.users.createUserA()
  })

  describe('serializer', () => {
    it('should return null when data = null', () => {
      const result = UploadProfile.serializer(null)
      assert.isNull(result, 'result')
    })
  })

  describe('create', () => {
    it('should create new uploadProfile', async () => {
      const fileName = 'fileName'
      const destination = 'destination'
      const uploadProfile = await UploadProfile.create({
        author: userA.id,
        fileName,
        destination,
      })
      assert.isString(uploadProfile.id, 'uploadProfile.id')
      expect(uploadProfile.author.toString()).equal(userA.id.toString())
      expect(uploadProfile.fileName).equal(fileName)
      expect(uploadProfile.destination).equal(destination)
      assert.isNotNull(uploadProfile.createdAt, 'uploadProfile.createdAt')
      assert.isNotNull(uploadProfile.updatedAt, 'uploadProfile.updatedAt')
      assert.isUndefined(uploadProfile.deletedAt, 'uploadProfile.deletedAt')
    })
  })
})


