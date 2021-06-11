import { expect, assert } from 'chai'

import {
  ArticleAction,
} from '../../../../src/database/mongo'
import { utils } from '../../../utils/api'

describe('src/database/mongo/article/ArticleAction.js', () => {
  let userA
  let article

  beforeEach(async () => {
    await utils.mongo.clearAll()
    userA = await utils.users.createUserA()
    article = await utils.articles.createArticle({ author: userA.id })
  })

  describe('update', () => {

    describe('action = like', () => {
      it('should create new articleAction with action like', async () => {
        const articleAction = await ArticleAction.update({
          authorId: userA.id,
          articleId: article.id,
          action: 'like',
        })
        assert.isString(articleAction.id, 'articleAction.id')
        expect(articleAction.articleId.toString()).equal(article.id.toString())
        expect(articleAction.authorId.toString()).equal(userA.id.toString())
        expect(articleAction.action).equal('like')
      })
    })

    describe('action = unlike', () => {
      beforeEach(async () => {
        await utils.articles.actionArticle({
          authorId: userA.id,
          articleId: article.id,
          action: 'like',
        })
      })

      it('should delete articleAction when action = unlike', async () => {
        await ArticleAction.update({
          authorId: userA.id,
          articleId: article.id,
          action: 'unlike',
        })

        const articleAction = await ArticleAction.findOneByArticleAuthor({
          authorId: userA.id,
          articleId: article.id,
        })
        assert.isNull(articleAction, 'articleAction')
      })
    })
  })

  describe('count', () => {
    let userB

    beforeEach(async () => {
      userB = await utils.users.createUserB()
    })

    describe('Nobody action article', () => {
      it('should return count = 0', async () => {
        const count = await ArticleAction.count({ articleId: article.id })
        expect(count).equal(0)
      })
    })

    describe('userA actions article', () => {
      beforeEach(async () => {
        await utils.articles.actionArticle({
          authorId: userA.id,
          articleId: article.id,
          action: 'like',
        })
      })

      it('should return count = 1', async () => {
        const count = await ArticleAction.count({ articleId: article.id })
        expect(count).equal(1)
      })
    })

    describe('userA and userB action article', () => {
      beforeEach(async () => {
        await utils.articles.actionArticle({
          authorId: userA.id,
          articleId: article.id,
          action: 'like',
        })
        await utils.articles.actionArticle({
          authorId: userB.id,
          articleId: article.id,
          action: 'like',
        })
      })

      it('should return count = 2', async () => {
        const count = await ArticleAction.count({ articleId: article.id })
        expect(count).equal(2)
      })
    })
  })
})


