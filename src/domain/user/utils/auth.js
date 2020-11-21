import { UNAUTHORIZED_ERROR } from '../../../error'

export function auth({ id, user }) {
  if (!user) {
    throw new UNAUTHORIZED_ERROR()
  }

  if (id !== user.userId) {
    throw new UNAUTHORIZED_ERROR()
  }
}