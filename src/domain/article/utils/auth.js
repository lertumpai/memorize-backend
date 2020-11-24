import { UNAUTHORIZED_ERROR } from '../../../error'

export function auth({ id, author, user }) {
  if (id !== user.userId) {
    throw new UNAUTHORIZED_ERROR()
  }
}