import bcrypt from 'bcrypt'
import _ from 'lodash'

import db from '../domain/utils/db'
const { User } = db

import { token } from './token'

export async function register(username, password) {
  const user = await User.findUserByUsername(username)

  if (user) {
    throw new Error(USERNAME_ALREADY_EXISTS)
  }

  const hash = bcrypt.hashSync(password, 10)

  return User.createUser({ username, password: hash, active: true })
}

export async function login(username, password) {
  const user = await User.findUserByUsername(username)

  if (_.isNil(user)) {
    throw new Error(USERNAME_NOT_EXISTS)
  }

  if (!bcrypt.compareSync(password, user.password)) {
    throw new Error(PASSWORD_INVALID)
  }

  return token({ userId: user.id, username: user.username, profile: user.profile })
}