import { expect, assert } from 'chai'

import {
  CommentAction,
} from '../../../../src/database/mongo'
import { utils } from '../../../utils/api'

describe('src/database/mongo/comment/CommentAction.js', () => {
  let userA
  let article
  let comment

  beforeEach(async () => {
    await utils.mongo.clearAll()
    userA = await utils.users.createUserA()
    article = await utils.articles.createArticle({ author: userA.id })
    comment = await utils.comments.createComment({
      author: userA.id,
      articleId: article.id,
    })
  })

  describe('update', () => {
    describe('action = like', () => {
      it('should create new commentAction with action like', async () => {
        const commentAction = await CommentAction.update({
          authorId: userA.id,
          commentId: comment.id,
          action: 'like',
        })
        assert.isString(commentAction.id, 'commentAction.id')
        expect(commentAction.commentId.toString()).equal(comment.id.toString())
        expect(commentAction.authorId.toString()).equal(userA.id.toString())
        expect(commentAction.action).equal('like')
      })
    })

    describe('action = unlike', () => {
      beforeEach(async () => {
        await utils.comments.actionComment({
          authorId: userA.id,
          commentId: comment.id,
          action: 'like',
        })
      })

      it('should delete commentAction when action = unlike', async () => {
        await CommentAction.update({
          authorId: userA.id,
          commentId: comment.id,
          action: 'unlike',
        })

        const commentAction = await CommentAction.findOneByCommentAuthor({
          authorId: userA.id,
          commentId: comment.id,
        })
        assert.isNull(commentAction, 'commentAction')
      })
    })
  })

  describe('count', () => {
    let userB

    beforeEach(async () => {
      userB = await utils.users.createUserB()
    })

    describe('Nobody action comment', () => {
      it('should return count = 0', async () => {
        const count = await CommentAction.count({ commentId: comment.id })
        expect(count).equal(0)
      })
    })

    describe('userA actions comment', () => {
      beforeEach(async () => {
        await utils.comments.actionComment({
          authorId: userA.id,
          commentId: comment.id,
          action: 'like',
        })
      })

      it('should return count = 1', async () => {
        const count = await CommentAction.count({ commentId: comment.id })
        expect(count).equal(1)
      })
    })

    describe('userA and userB action comment', () => {
      beforeEach(async () => {
        await utils.comments.actionComment({
          authorId: userA.id,
          commentId: comment.id,
          action: 'like',
        })
        await utils.comments.actionComment({
          authorId: userB.id,
          commentId: comment.id,
          action: 'like',
        })
      })

      it('should return count = 2', async () => {
        const count = await CommentAction.count({ commentId: comment.id })
        expect(count).equal(2)
      })
    })
  })
})


