import { expect, assert } from 'chai'

import {
  Article,
} from '../../../../src/database/mongo'
import { utils } from '../../../utils/api'

describe('src/database/mongo/user/User.js', () => {
  beforeEach(async () => {
    await utils.mongo.clearAll()
  })

  describe('create', () => {
    let user
    beforeEach(async () => {
      user = await utils.users.createUserA()
    })

    it('should create new article', async () => {
      const content = 'content'
      const image = utils.mongo.objectId()
      const article = await Article.create({ author: user.id, content, image })
      assert.isString(article.id, 'article.id')
      expect(article.author.toString()).equal(user.id.toString())
      expect(article.content).equal(content)
      expect(article.image.toString()).equal(image.toString())
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
      article = await utils.articles.createArticle({ author: user.id, image: utils.mongo.objectId() })
    })

    it('should update article when article exists', async () => {
      const content = 'update content'
      const imageId = utils.mongo.objectId()
      const updatedArticle = await Article.update(article.id, { content, image: { id: imageId } })
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

  // TODO: fix findAll to use ID instead of createdAt and use createdAt to sort only
  // describe('findAll', () => {
  //   let userA
  //   let userB
  //   const articleSize = 5
  //   beforeEach(async () => {
  //     userA = await utils.users.createUserA()
  //     userB = await utils.users.createUserB()
  //     await Promise.all([
  //       utils.articles.createArticles({ author: userA.id }, { size: articleSize }),
  //       utils.articles.createArticles({ author: userB.id }, { size: articleSize }),
  //     ])
  //   })
  //
  //   it('should return articles by author', async () => {
  //     const articles = await Article.findAll({ author: userA.id }, {})
  //     expect(articles.data).to.have.length(articleSize)
  //     articles.data.forEach(article => expect(article.author.toString()).equal(userA.id.toString()))
  //   })
  // })
})


