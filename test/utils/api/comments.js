import {
  Comment,
  CommentAction,
} from '../../../src/database/mongo'

export function createComment({ author, articleId, content = 'content' }) {
  return Comment.create({ author, articleId, content })
}

export function createComments({ author, articleId, content = 'content' }, { size = 10 }) {
  return Promise.all([...Array(size).keys()].map(() => createComment({ author, articleId, content })))
}

export function actionComment({ authorId, commentId, action = 'like' }) {
  return CommentAction.update({ authorId, commentId, action })
}
