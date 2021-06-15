import sinon from 'sinon'
import { assert, expect } from 'chai'
import { gql } from 'apollo-server-express'

import { requestMutation, requestQuery } from '../../server'
import { ArticleFragment } from '../../utils/gql/article'
import { utils } from '../../utils/api'
import * as upload from '../../../src/domain/upload/utils/upload'

describe('src/domain/article/resolvers.js', () => {
  beforeEach(async () => {
    await utils.mongo.clearAll()
  })

  afterEach(() => {
    sinon.restore()
  })

  describe('query', () => {
    describe('article', () => {
      const ARTICLE = gql`
        query article($id: MID!) {
          article(id: $id) {
            ...ArticleFragment
          }
        }
        ${ArticleFragment}
      `

      let userA
      let userB
      let article
      beforeEach(async () => {
        userA = await utils.users.createUserA()
        userB = await utils.users.createUserB()
        article = await utils.articles.createArticle({ author: userA.id })
      })

      it('should return article by id', async () => {
        const variables = {
          id: article.id,
        }
        const { article: queryArticle } = await requestQuery({ schema: ARTICLE, variables }, { context: userA.context })
        assert.isString(queryArticle.id, 'queryArticle.id')
        expect(queryArticle.author.id.toString()).equal(userA.id.toString())
        assert.isNull(queryArticle.image, 'queryArticle.image')
        assert.isTrue(queryArticle.active, 'queryArticle.active')
        assert.isNull(queryArticle.userAction, 'queryArticle.userAction')
        expect(queryArticle.action).equal('0')
        expect(queryArticle.comment).equal('0')
        assert.isTrue(queryArticle.canMutate, 'queryArticle.canMutate')
        assert.isNotNull(queryArticle.createdAt, 'queryArticle.createdAt')
        assert.isNotNull(queryArticle.updatedAt, 'queryArticle.updatedAt')
        assert.isNull(queryArticle.deletedAt, 'queryArticle.deletedAt')
      })

      it('should return canMutate = false if not author', async () => {
        const variables = {
          id: article.id,
        }
        const { article: queryArticle } = await requestQuery({ schema: ARTICLE, variables }, { context: userB.context })
        assert.isFalse(queryArticle.canMutate, 'queryArticle.canMutate')
      })
    })

    describe('articles', () => {
      const ARTICLES = gql`
        query articles($author: MID, $pagination: Pagination) {
          articles(author: $author, pagination: $pagination) {
            data {
              ...ArticleFragment
            }
            hasMore
          }
        }
        ${ArticleFragment}
      `

      let userA
      const sizeArticles = 20
      beforeEach(async () => {
        const faketimer = sinon.useFakeTimers(new Date())
        userA = await utils.users.createUserA()
        for (let i = 0; i < sizeArticles; i++) {
          await utils.articles.createArticle({ author: userA.id })
          faketimer.tick(1000)
        }
      })

      it('should return by author Id', async () => {
        const variables = {
          author: userA.id,
          pagination: {
            limit: 10,
          },
        }
        const { articles } = await requestQuery({ schema: ARTICLES, variables }, { context: userA.context })
        expect(articles.data).to.have.length(10)
        articles.data.forEach(article => {
          expect(article.author.id.toString()).equal(userA.id.toString())
        })
        assert.isTrue(articles.hasMore, 'articles.hasMore')
      })

      it('should return hasMore = false', async () => {
        const variables = {
          author: userA.id,
          pagination: {
            limit: 20,
          },
        }
        const { articles } = await requestQuery({ schema: ARTICLES, variables }, { context: userA.context })
        expect(articles.data).to.have.length(20)
        assert.isFalse(articles.hasMore, 'articles.hasMore')
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
        let userA
        let userB
        let article
        beforeEach(async () => {
          userA = await utils.users.createUserA()
          userB = await utils.users.createUserB()
          article = await utils.articles.createArticle({ author: userA.id })
        })

        it('should update article', async () => {
          const variables = {
            id: article.id,
            ArticleInput: {
              content: 'update article',
            },
          }
          const { article: updatedArticle } = await requestMutation({ schema: ARTICLE, variables }, { context: userA.context })
          expect(updatedArticle.content).equal(variables.ArticleInput.content)
        })

        it('should throw UNAUTHORIZED_ERROR when not owner', async () => {
          try {
            const variables = {
              id: article.id,
              ArticleInput: {
                content: 'update article',
              },
            }
            await requestMutation({ schema: ARTICLE, variables }, { context: userB.context })
          } catch(e) {
            expect(e.extensions.exception.name).equal('UNAUTHORIZED_ERROR')
          }
        })

        it('should throw NOT_FOUND_ERROR when article not found', async () => {
          const variables = {
            id: utils.mongo.objectId(),
            ArticleInput: {
              content: 'update article',
            },
          }
          try {
            await requestQuery({ schema: ARTICLE, variables }, { context: userA.context })
          } catch(e) {
            expect(e.extensions.exception.name).equal('NOT_FOUND_ERROR')
          }
        })
      })
    })

    describe('articleDelete', () => {
      const DELETE_ARTICLE = gql`
        mutation articleDelete($id: MID!) {
          articleDelete(id: $id) {
            ...ArticleFragment
          }
        }
        ${ArticleFragment}
      `

      let userA
      let userB
      let article
      beforeEach(async () => {
        userA = await utils.users.createUserA()
        userB = await utils.users.createUserB()
        article = await utils.articles.createArticle({ author: userA.id })
      })

      it('should delete article and stamp deletedAt', async () => {
        const variables = {
          id: article.id,
        }
        const { articleDelete } = await requestMutation({ schema: DELETE_ARTICLE, variables }, { context: userA.context })
        assert.isNotNull(articleDelete.deletedAt)
        expect(articleDelete.deletedAt).to.not.equal(undefined)
      })

      it('should throw UNAUTHORIZED_ERROR when not owner', async () => {
        try {
          const variables = {
            id: article.id,
          }
          await requestMutation({ schema: DELETE_ARTICLE, variables }, { context: userB.context })
        } catch(e) {
          expect(e.extensions.exception.name).equal('UNAUTHORIZED_ERROR')
        }
      })
    })
  })
})


