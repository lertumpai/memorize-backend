import sinon from 'sinon'
import { assert, expect } from 'chai'
import { gql } from 'apollo-server-express'

import { requestMutation, requestQuery } from '../../server'
import { ArticleFragment } from '../../utils/gql/article'
import { utils } from '../../utils/api'
import { UploadArticle } from '../../../src/database/mongo'
import * as upload from '../../../src/domain/upload/utils/upload'
import { UserFragment } from '../../utils/gql/user'

describe('src/domain/article/resolvers.js', () => {
  beforeEach(async () => {
    await utils.mongo.clearAll()
  })

  afterEach(() => {
    sinon.restore()
  })

  describe('schema', () => {
    it('', () => {

    })
  })

  describe('query', () => {
    describe('article', () => {
      it('', () => {

      })
    })

    describe('articles', () => {
      it('', () => {

      })
    })
  })

  describe('mutation', () => {
    describe('article', () => {
      const ARTICLE = gql`
        mutation article($id: MID, $ArticleInput: ArticleInput!) {
          article(id: $id, input: $ArticleInput) {
            ...ArticleFragment
          }
        }
        ${ArticleFragment}
      `

      describe('create', () => {
        let userA
        beforeEach(async () => {
          userA = await utils.users.createUserA()
        })

        it('should create article with image', async () => {
          const variables = {
            ArticleInput: {
              content: 'article',
              image: {
                destination: 'destination',
                fileName: 'fileName',
              },
            },
          }
          sinon.stub(upload, 'getImageUrl').returns('image')
          const { article } = await requestMutation({ schema: ARTICLE, variables }, { context: userA.context })
          assert.isString(article.id, 'article.id')
          expect(article.author.id.toString()).equal(userA.id.toString())
          expect(article.content).equal(variables.ArticleInput.content)
          expect(article.image).equal('image')
          assert.isTrue(article.active, 'article.active')
          assert.isNull(article.userAction, 'article.userAction')
          expect(article.action).equal('0')
          expect(article.comment).equal('0')
          assert.isTrue(article.canMutate, 'article.canMutate')
          assert.isNotNull(article.createdAt, 'article.createdAt')
          assert.isNotNull(article.updatedAt, 'article.updatedAt')
          assert.isNull(article.deletedAt, 'article.deletedAt')
        })

        it('should create article without image', async () => {
          const variables = {
            ArticleInput: {
              content: 'article',
            },
          }
          const { article } = await requestMutation({ schema: ARTICLE, variables }, { context: userA.context })
          assert.isString(article.id, 'article.id')
          expect(article.author.id.toString()).equal(userA.id.toString())
          expect(article.content).equal(variables.ArticleInput.content)
          assert.isNull(article.image, 'article.image')
          assert.isTrue(article.active, 'article.active')
          assert.isNull(article.userAction, 'article.userAction')
          expect(article.action).equal('0')
          expect(article.comment).equal('0')
          assert.isTrue(article.canMutate, 'article.canMutate')
          assert.isNotNull(article.createdAt, 'article.createdAt')
          assert.isNotNull(article.updatedAt, 'article.updatedAt')
          assert.isNull(article.deletedAt, 'article.deletedAt')
        })
      })

      describe('update', () => {

      })
    })

    describe('articleDelete', () => {
      it('', () => {

      })
    })
  })
})


