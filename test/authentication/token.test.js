import { expect } from 'chai'
import sinon from 'sinon'

import {
  UploadProfile,
} from '../../src/database/mongo'
import * as upload from '../../src/domain/upload/utils/upload'
import { token, verifyToken } from '../../src/authentication/token'
import { utils } from '../utils/api'

describe('authentication/token.js', () => {
  beforeEach(() => {
    sinon.stub(UploadProfile, 'findById').returns({ fileName: null, destination: null })
    sinon.stub(upload, 'getImageUrl').returns('urlImage')
  })

  afterEach(() => {
    sinon.restore()
  })

  describe('token', () => {
    it('should return token when have image profile', async () => {
      const result = await token(utils.users.users.userA)
      expect(typeof result).equal('string')
    })

    it('should return token when not have image profile', async () => {
      const result = await token(utils.users.users.userB)
      expect(typeof result).equal('string')
    })

    it('should return null when user = null', async () => {
      const result = await token(null)
      expect(result).equal(null)
    })
  })

  describe('verifyToken', () => {
    it('should return null when token = null', async () => {
      const result = await verifyToken(null)
      expect(result).equal(null)
    })

    it('should return null when token is invalid', async () => {
      const result = await verifyToken('invalid token')
      expect(result).equal(null)
    })

    it('should return user object when token is valid', async () => {
      const tokenUserA = await token(utils.users.users.userA)
      const result = await verifyToken(tokenUserA)
      expect(result.username).equal(utils.users.users.userA.username)
    })
  })
})


