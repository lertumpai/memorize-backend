import bcrypt from 'bcrypt'

import { token } from './token'
import { DUPLICATED_VALUE_ERROR, LOGIN_FAIL_ERROR } from '../error'

export async function register({ username, password }, { User }) {
  const user = await User.findUserByUsername(username)

  if (user) {
    throw new DUPLICATED_VALUE_ERROR('User')
  }

  const hash = bcrypt.hashSync(password, 10)

  return User.createUser({ username, password: hash, active: true })
}

export async function login({ username, password }, { User }) {
  const user = await User.findUserByUsername(username)

  const checks = []
  if (user) checks.push('Username')
  if (!bcrypt.compareSync(password, user.password)) checks.push('password')
  if (checks.length !== 0) throw new LOGIN_FAIL_ERROR(checks)

  return token({ userId: user.id, username: user.username, profile: user.profile })
}