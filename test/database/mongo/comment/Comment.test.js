import { expect, assert } from 'chai'

import {
  Comment,
} from '../../../../src/database/mongo'
import { utils } from '../../../utils/api'

describe('src/database/mongo/comment/Comment.js', () => {
  let userA
  let article
  beforeEach(async () => {
    await utils.mongo.clearAll()
    userA = await utils.users.createUserA()
    article = await utils.articles.createArticle({ author: userA.id })
  })

  describe('create', () => {
    it('should create new comment', async () => {
      const content = 'content'
      const comment = await Comment.create({ author: userA.id, articleId: article.id, content })
      assert.isString(comment.id, 'comment.id')
      expect(comment.author.toString()).equal(userA.id.toString())
      expect(comment.articleId.toString()).equal(article.id.toString())
      expect(comment.content).equal(content)
      assert.isNotNull(comment.createdAt, 'comment.createdAt')
      assert.isNotNull(comment.updatedAt, 'comment.updatedAt')
      assert.isUndefined(comment.deletedAt, 'comment.deletedAt')
      assert.isTrue(comment.active, 'comment.active')
    })
  })

  describe('update', () => {
    let comment
    beforeEach(async () => {
      comment = await utils.comments.createComment({
        author: userA.id,
        articleId: article.id,
      })
    })

    it('should update comment', async () => {
      const updatedContent = 'update content'
      await Comment.update(comment.id, { content: updatedContent })
      const updatedComment = await Comment.findById(comment.id)
      expect(updatedComment.content).equal(updatedContent)
    })

    it('should not update comment when not input', async () => {
      await Comment.update(comment.id, {})
      const updatedComment = await Comment.findById(comment.id)
      expect(updatedComment.content).equal(comment.content)
    })

    it('should throw when comment not exists', async () => {
      try {
        await Comment.update(utils.mongo.objectId(), {})
      } catch(e) {
        expect(e.name).equal('NOT_FOUND_ERROR')
        expect(e.message.comment).equal('comment is not found')
      }
    })
  })

  describe('count', () => {
    let userB
    beforeEach(async () => {
      userB = await utils.users.createUserB()
    })

    describe('Count all comment that active', () => {
      beforeEach(async () => {
        const articleB = article = await utils.articles.createArticle({ author: userB.id })
        await utils.comments.createComment({
          author: userA.id,
          articleId: article.id,
        })
        await utils.comments.createComment({
          author: userA.id,
          articleId: articleB.id,
        })
      })

      it('should return count = 2', async () => {
        const count = await Comment.count({})
        expect(count).equal(2)
      })
    })

    describe('Not comment article', () => {
      it('should return count = 0', async () => {
        const count = await Comment.count({ articleId: article.id })
        expect(count).equal(0)
      })
    })

    describe('userA comment article', () => {
      beforeEach(async () => {
        await utils.comments.createComment({
          author: userA.id,
          articleId: article.id,
        })
      })

      it('should return count = 1', async () => {
        const count = await Comment.count({ articleId: article.id })
        expect(count).equal(1)
      })
    })

    describe('userA and userB comment article', () => {
      beforeEach(async () => {
        await utils.comments.createComment({
          author: userA.id,
          articleId: article.id,
        })
        await utils.comments.createComment({
          author: userB.id,
          articleId: article.id,
        })
      })

      it('should return count = 2', async () => {
        const count = await Comment.count({ articleId: article.id })
        expect(count).equal(2)
      })
    })
  })

  describe('deleteByArticle', () => {
    beforeEach(async () => {
      await utils.comments.createComment({
        author: userA.id,
        articleId: article.id,
      })
      await utils.comments.createComment({
        author: userA.id,
        articleId: article.id,
      })
    })

    it('should update deletedAt to all comment', async () => {
      const beforeDeleteComments = await Comment.findAll({ articleId: article.id }, {})
      beforeDeleteComments.data.forEach(comment => assert.isUndefined(comment.deletedAt, 'comment.deletedAt'))

      await Comment.deleteByArticle(article.id)

      const afterDeleteComments = await Comment.findAll({ articleId: article.id }, {})
      afterDeleteComments.data.forEach(comment => assert.isNotNull(comment.deletedAt, 'comment.deletedAt'))
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


