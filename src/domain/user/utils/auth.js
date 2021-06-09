import { NOT_FOUND_ERROR, UNAUTHORIZED_ERROR } from '../../../error'

import {
  User,
} from '../../../database/mongo'

export async function authUser(id, user) {
  const foundUser = await User.findById(id)

  if (!foundUser) {
    throw new NOT_FOUND_ERROR('user')
  }

  if (id.toString() !== user.id.toString()) {
    throw new UNAUTHORIZED_ERROR()
  }
}
