import sinon from 'sinon'
import { assert, expect } from 'chai'
import { gql } from 'apollo-server-express'

import { requestMutation, requestQuery } from '../../server'
import { CommentFragment } from '../../utils/gql/comment'
import { utils } from '../../utils/api'

describe('src/domain/comment/resolvers.js', () => {
  beforeEach(async () => {
    await utils.mongo.clearAll()
  })

  afterEach(() => {
    sinon.restore()
  })

  describe('query', () => {
    describe('comment', () => {
      const COMMENT = gql`
        query comment($id: MID!) {
          comment(id: $id) {
            ...CommentFragment
          }
        }
        ${CommentFragment}
      `

      let userA
      let userB
      let article
      let comment
      beforeEach(async () => {
        userA = await utils.users.createUserA()
        userB = await utils.users.createUserB()
        article = await utils.articles.createArticle({ author: userA.id })
        comment = await utils.comments.createComment({ author: userA.id, articleId: article.id})
      })

      it('should return comment by id', async () => {
        const variables = {
          id: comment.id,
        }
        const { comment: queryComment } = await requestQuery({ schema: COMMENT, variables }, { context: userA.context })
        assert.isString(queryComment.id, 'queryComment.id')
        expect(queryComment.author.id.toString()).equal(userA.id.toString())
        expect(queryComment.article.id.toString()).equal(article.id.toString())
        assert.isString(queryComment.content, 'queryComment.content')
        assert.isTrue(queryComment.active, 'queryComment.active')
        assert.isNull(queryComment.userAction, 'queryComment.userAction')
        expect(queryComment.action).equal('0')
        assert.isTrue(queryComment.canMutate, 'queryComment.canMutate')
        assert.isNotNull(queryComment.createdAt, 'queryComment.createdAt')
        assert.isNotNull(queryComment.updatedAt, 'queryComment.updatedAt')
        assert.isNull(queryComment.deletedAt, 'queryComment.deletedAt')
      })

      it('should return canMutate = false if not author', async () => {
        const variables = {
          id: comment.id,
        }
        const { comment: queryComment } = await requestQuery({ schema: COMMENT, variables }, { context: userB.context })
        assert.isFalse(queryComment.canMutate, 'queryComment.canMutate')
      })
    })

    describe('comments', () => {
      const COMMENTS = gql`
        query comments($articleId: MID!, $pagination: Pagination) {
          comments(articleId: $articleId, pagination: $pagination) {
            data {
              ...CommentFragment
            }
            hasMore
          }
        }
        ${CommentFragment}
      `

      let userA
      let article
      const sizeComments = 20
      beforeEach(async () => {
        const faketimer = sinon.useFakeTimers(new Date())
        userA = await utils.users.createUserA()
        article = await utils.articles.createArticle({ author: userA.id })
        for (let i = 0; i < sizeComments; i++) {
          await utils.comments.createComment({ articleId: article.id, author: userA.id })
          faketimer.tick(1000)
        }
      })

      it('should return comments by article Id', async () => {
        const variables = {
          articleId: article.id,
          pagination: {
            limit: 10,
          },
        }
        const { comments } = await requestQuery({ schema: COMMENTS, variables }, { context: userA.context })
        expect(comments.data).to.have.length(10)
        comments.data.forEach(comment => {
          expect(comment.author.id.toString()).equal(userA.id.toString())
        })
        assert.isTrue(comments.hasMore, 'comments.hasMore')
      })

      it('should return hasMore = false', async () => {
        const variables = {
          articleId: article.id,
          pagination: {
            limit: 20,
          },
        }
        const { comments } = await requestQuery({ schema: COMMENTS, variables }, { context: userA.context })
        expect(comments.data).to.have.length(20)
        assert.isFalse(comments.hasMore, 'comments.hasMore')
      })
    })
  })

  describe('mutation', () => {
    describe('comment', () => {
      const COMMENT = gql`
        mutation comment($id: MID, $CommentInput: CommentInput!) {
          comment(id: $id, input: $CommentInput) {
            ...CommentFragment
          }
        }
        ${CommentFragment}
      `

      let userA
      let userB
      let article

      beforeEach(async () => {
        userA = await utils.users.createUserA()
        userB = await utils.users.createUserB()
        article = await utils.articles.createArticle({ author: userA.id })
      })

      describe('create', () => {
        it('should create comment', async () => {
          const variables = {
            CommentInput: {
              articleId: article.id,
              content: 'comment',
            },
          }
          const { comment } = await requestMutation({ schema: COMMENT, variables }, { context: userA.context })
          assert.isString(comment.id, 'comment.id')
          expect(comment.author.id.toString()).equal(userA.id.toString())
          expect(comment.article.id.toString()).equal(article.id.toString())
          assert.isString(comment.content, 'comment.content')
          expect(comment.content).equal(variables.CommentInput.content)
          assert.isTrue(comment.active, 'comment.active')
          assert.isNull(comment.userAction, 'comment.userAction')
          expect(comment.action).equal('0')
          assert.isTrue(comment.canMutate, 'comment.canMutate')
          assert.isNotNull(comment.createdAt, 'comment.createdAt')
          assert.isNotNull(comment.updatedAt, 'comment.updatedAt')
          assert.isNull(comment.deletedAt, 'comment.deletedAt')
        })

        it('should throw NOT_FOUND_ERROR when not found article', async () => {
          const variables = {
            CommentInput: {
              articleId: utils.mongo.objectId(),
              content: 'comment',
            },
          }
          try {
            await requestMutation({ schema: COMMENT, variables }, { context: userA.context })
          } catch(e) {
            expect(e.extensions.exception.name).equal('NOT_FOUND_ERROR')
          }
        })
      })

      describe('update', () => {
        let comment
        beforeEach(async () => {
          comment = await utils.comments.createComment({ author: userA.id, articleId: article.id })
        })

        it('should update comment', async () => {
          const variables = {
            id: comment.id,
            CommentInput: {
              content: 'update comment',
            },
          }
          const { comment: updatedComment } = await requestMutation({ schema: COMMENT, variables }, { context: userA.context })
          expect(updatedComment.content).equal(variables.CommentInput.content)
        })

        it('should throw UNAUTHORIZED_ERROR when not owner', async () => {
          const variables = {
            id: comment.id,
            CommentInput: {
              content: 'update comment',
            },
          }
          try {
            await requestMutation({ schema: COMMENT, variables }, { context: userB.context })
          } catch(e) {
            expect(e.extensions.exception.name).equal('UNAUTHORIZED_ERROR')
          }
        })

        it('should throw NOT_FOUND_ERROR when comment not found', async () => {
          const variables = {
            id: utils.mongo.objectId(),
            CommentInput: {
              content: 'update comment',
            },
          }
          try {
            await requestMutation({ schema: COMMENT, variables }, { context: userB.context })
          } catch(e) {
            expect(e.extensions.exception.name).equal('NOT_FOUND_ERROR')
          }
        })
      })
    })

    describe('commentDelete', () => {
      const DELETE_COMMENT = gql`
        mutation commentDelete($id: MID!) {
          commentDelete(id: $id) {
            ...CommentFragment
          }
        }
        ${CommentFragment}
      `

      let userA
      let userB
      let article
      let comment
      beforeEach(async () => {
        userA = await utils.users.createUserA()
        userB = await utils.users.createUserB()
        article = await utils.articles.createArticle({ author: userA.id })
        comment = await utils.comments.createComment({ author: userA.id, articleId: article.id })
      })

      it('should delete comment and stamp deletedAt', async () => {
        const variables = {
          id: comment.id,
        }
        const { commentDelete } = await requestMutation({ schema: DELETE_COMMENT, variables }, { context: userA.context })
        assert.isNotNull(commentDelete.deletedAt, 'commentDelete.deletedAt')
        expect(commentDelete.deletedAt).to.not.equal(undefined)
      })

      it('should throw UNAUTHORIZED_ERROR when not owner', async () => {
        const variables = {
          id: comment.id,
        }
        try {
          await requestMutation({ schema: DELETE_COMMENT, variables }, { context: userB.context })
        } catch(e) {
          expect(e.extensions.exception.name).equal('UNAUTHORIZED_ERROR')
        }
      })
    })
  })
})
