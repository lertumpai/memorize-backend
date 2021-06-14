import { expect, assert } from 'chai'

import {
  Comment,
} from '../../../../src/database/mongo'
import { utils } from '../../../utils/api'
import sinon from 'sinon'

describe('src/database/mongo/comment/Comment.js', () => {
  beforeEach(async () => {
    await utils.mongo.clearAll()
  })

  describe('serializer', () => {
    it('should return null when data = null', () => {
      const result = Comment.serializer(null)
      assert.isNull(result, 'result')
    })
  })

  describe('create', () => {
    let userA
    let article
    beforeEach(async () => {
      userA = await utils.users.createUserA()
      article = await utils.articles.createArticle({ author: userA.id })
    })

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
    let userA
    let article
    beforeEach(async () => {
      userA = await utils.users.createUserA()
      article = await utils.articles.createArticle({ author: userA.id })
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
    describe('Count all comment that active', () => {
      let userA
      let userB
      let article

      beforeEach(async () => {
        userA = await utils.users.createUserA()
        userB = await utils.users.createUserB()
        article = await utils.articles.createArticle({ author: userA.id })
        const articleB = await utils.articles.createArticle({ author: userB.id })
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
      let userA
      let article

      beforeEach(async () => {
        userA = await utils.users.createUserA()
        article = await utils.articles.createArticle({ author: userA.id })
      })

      it('should return count = 0', async () => {
        const count = await Comment.count({ articleId: article.id })
        expect(count).equal(0)
      })
    })

    describe('userA comment article', () => {
      let userA
      let article

      beforeEach(async () => {
        userA = await utils.users.createUserA()
        article = await utils.articles.createArticle({ author: userA.id })
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
      let userA
      let userB
      let article

      beforeEach(async () => {
        userA = await utils.users.createUserA()
        userB = await utils.users.createUserB()
        article = await utils.articles.createArticle({ author: userA.id })
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
    let userA
    let article

    beforeEach(async () => {
      userA = await utils.users.createUserA()
      article = await utils.articles.createArticle({ author: userA.id })
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

  describe('findAll', () => {
    let userA
    let userB
    let article
    const commentSize = 5
    beforeEach(async () => {
      const faketime = sinon.useFakeTimers(new Date())

      userA = await utils.users.createUserA()
      article = await utils.articles.createArticle({ author: userA.id })
      for (let i = 0; i < commentSize; i++) {
        await utils.comments.createComment({ articleId: article.id, author: userA.id })
        faketime.tick(1000)
      }

      userB = await utils.users.createUserB()
      for (let i = 0; i < commentSize; i++) {
        await utils.comments.createComment({ articleId: article.id, author: userB.id })
        faketime.tick(1000)
      }
    })

    afterEach(() => {
      sinon.restore()
    })

    it('should return all comment and sort by createdAt', async () => {
      const comments = await Comment.findAll({}, {})
      expect(comments.data).to.have.length(commentSize * 2)
      for (let i = 1; i < comments.data.length; i++) {
        const prev = comments.data[i - 1]
        const cur = comments.data[i]
        expect(new Date(prev.createdAt).valueOf()).to.be.greaterThan(new Date(cur.createdAt).valueOf())
      }
    })

    it('should return and sort by createdAt and articleId', async () => {
      const comments = await Comment.findAll({ articleId: article.id }, {})
      expect(comments.data).to.have.length(commentSize * 2)
      for (let i = 1; i < comments.data.length; i++) {
        const prev = comments.data[i - 1]
        const cur = comments.data[i]
        expect(new Date(prev.createdAt).valueOf()).to.be.greaterThan(new Date(cur.createdAt).valueOf())
      }
    })
  })
})


