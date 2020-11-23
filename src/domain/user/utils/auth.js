import { NOT_FOUND_ERROR, UNAUTHORIZED_ERROR } from '../../../error'

export async function auth({ id, user }, { User }) {
  const foundUser = await User.findById(id)

  if (!foundUser) {
    throw new NOT_FOUND_ERROR('user')
  }

  if (id !== user.userId) {
    throw new UNAUTHORIZED_ERROR()
  }
}