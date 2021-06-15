import sinon from 'sinon'
import { expect, assert } from 'chai'

import {
  Article,
} from '../../../../src/database/mongo'
import { utils } from '../../../utils/api'

describe('src/database/mongo/article/Article.js', () => {
  beforeEach(async () => {
    await utils.mongo.clearAll()
  })

  describe('serializer', () => {
    it('should return null when data = null', () => {
      const result = Article.serializer(null)
      assert.isNull(result, 'result')
    })
  })

  describe('create', () => {
    let user
    beforeEach(async () => {
      user = await utils.users.createUserA()
    })

    it('should create new article', async () => {
      const content = 'content'
      const image = { id: utils.mongo.objectId() }
      const article = await Article.create({ author: user.id, content, image })
      assert.isString(article.id, 'article.id')
      expect(article.author.toString()).equal(user.id.toString())
      expect(article.content).equal(content)
      expect(article.image.toString()).equal(image.id.toString())
      assert.isNotNull(article.createdAt, 'article.createdAt')
      assert.isNotNull(article.updatedAt, 'article.updatedAt')
      assert.isUndefined(article.deletedAt, 'article.deletedAt')
      assert.isTrue(article.active, 'article.active')
    })
  })

  describe('update', () => {
    let user
    let article
    beforeEach(async () => {
      user = await utils.users.createUserA()
      article = await utils.articles.createArticle({ author: user.id, image: { id: utils.mongo.objectId() } })
    })

    it('should update article when article exists', async () => {
      const content = 'update content'
      const imageId = utils.mongo.objectId()
      await Article.update(article.id, { content, image: { id: imageId } })
      const updatedArticle = await Article.findById(article.id)
      expect(updatedArticle.content).equal(content)
      expect(updatedArticle.image.toString()).equal(imageId.toString())
    })

    it('should not update article when not input', async () => {
      const updatedArticle = await Article.update(article.id, {})
      expect(updatedArticle.content).equal(article.content)
      expect(updatedArticle.image.toString()).equal(article.image.toString())
    })

    it('should throw  when article not exists', async () => {
      const articleId = utils.mongo.objectId()
      try {
        await Article.update(articleId, {})
      } catch(e) {
        expect(e.name).equal('NOT_FOUND_ERROR')
        expect(e.message.article).equal('article is not found')
      }
    })
  })

  describe('findAll', () => {
    let userA
    let userB
    const articleSize = 5
    beforeEach(async () => {
      const faketime = sinon.useFakeTimers(new Date())
      userA = await utils.users.createUserA()
      for (let i = 0; i < articleSize; i++) {
        await utils.articles.createArticle({ author: userA.id })
        faketime.tick(1000)
      }

      userB = await utils.users.createUserB()
      for (let i = 0; i < articleSize; i++) {
        await utils.articles.createArticle({ author: userB.id })
        faketime.tick(1000)
      }
    })

    afterEach(() => {
      sinon.restore()
    })

    it('should return articles by author', async () => {
      const articles = await Article.findAll({ author: userA.id }, {})
      expect(articles.data).to.have.length(articleSize)
      articles.data.forEach(article => expect(article.author.toString()).equal(userA.id.toString()))
    })

    it('should return and sort by createdAt', async () => {
      const articles = await Article.findAll({}, {})
      expect(articles.data).to.have.length(articleSize * 2)
      for (let i = 1; i < articles.data.length; i++) {
        const prev = articles.data[i - 1]
        const cur = articles.data[i]
        expect(new Date(prev.createdAt).valueOf()).to.be.greaterThan(new Date(cur.createdAt).valueOf())
      }
    })
  })
})


