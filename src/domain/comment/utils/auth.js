import { UNAUTHORIZED_ERROR, NOT_FOUND_ERROR } from '../../../error'

export async function auth({ id }, { Comment, user }) {
  const comment = await Comment.findById(id)

  if (!comment) {
    throw new NOT_FOUND_ERROR('comment')
  }

  if (comment.author.toString() !== user.userId.toString()) {
    throw new UNAUTHORIZED_ERROR()
  }
}