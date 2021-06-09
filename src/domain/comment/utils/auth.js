import { UNAUTHORIZED_ERROR, NOT_FOUND_ERROR } from '../../../error'

import {
  Comment,
} from '../../../database/mongo'

export async function authComment(id, user) {
  const comment = await Comment.findById(id)

  if (!comment) {
    throw new NOT_FOUND_ERROR('comment')
  }

  if (comment.author.toString() !== user.id.toString()) {
    throw new UNAUTHORIZED_ERROR()
  }

  return true
}
