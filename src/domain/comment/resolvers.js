import nFormatter from '../../utils/nFormatter'

import {
  Comment,
  Article,
  User,
  CommentAction,
} from '../../database/mongo'

module.exports = {
  Query: {
    comment(_, { id }) {
      return Comment.findById(id)
    },
    comments(_, { articleId, pagination }) {
      return Comment.findAll({ articleId }, pagination)
    },
  },
  Mutation: {
    comment(_, { id, input }, { user, date }) {
      const { content, articleId } = input
      return id ? Comment.update(id, { content, date }) : Comment.create({ articleId, author: user.id, content, date })
    },
    commentDelete(_, { id }, { date }) {
      return Comment.deleteById(id, { date })
    },
  },
  Comment: {
    author({ author }) {
      return User.findById(author)
    },
    article({ articleId }) {
      return Article.findById(articleId)
    },
    canMutate({ author }, _, { user }) {
      return author.toString() === user.id.toString()
    },
    async action({ id }) {
      const commentActionCount = await CommentAction.count({ commentId: id })
      return nFormatter(commentActionCount)
    },
    userAction({ id }, _, { user }) {
      return CommentAction.findOneByCommentAuthor({ commentId: id, authorId: user.id })
    },
  },
}
