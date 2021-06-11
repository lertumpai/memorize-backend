import { expect, assert } from 'chai'

import {
  UploadArticle,
} from '../../../../src/database/mongo'
import { utils } from '../../../utils/api'

describe('src/database/mongo/upload/UploadArticle.js', () => {
  let userA
  beforeEach(async () => {
    await utils.mongo.clearAll()
    userA = await utils.users.createUserA()
  })

  describe('create', () => {
    it('should create new uploadArticle', async () => {
      const fileName = 'fileName'
      const destination = 'destination'
      const uploadArticle = await UploadArticle.create({
        author: userA.id,
        fileName,
        destination,
      })
      assert.isString(uploadArticle.id, 'uploadArticle.id')
      expect(uploadArticle.author.toString()).equal(userA.id.toString())
      expect(uploadArticle.fileName).equal(fileName)
      expect(uploadArticle.destination).equal(destination)
      assert.isNotNull(uploadArticle.createdAt, 'uploadArticle.createdAt')
      assert.isNotNull(uploadArticle.updatedAt, 'uploadArticle.updatedAt')
      assert.isUndefined(uploadArticle.deletedAt, 'uploadArticle.deletedAt')
    })
  })
})


