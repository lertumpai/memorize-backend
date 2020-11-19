import bcrypt from 'bcrypt'

import { token } from './token'
import { DUPLICATED_VALUE_ERROR, LOGIN_FAIL_ERROR, REGISTER_FAIL_ERROR } from '../error'

export async function register({ username, password }, { User }) {
  const checks = []
  if (!username) checks.push('Username')
  if (!password) checks.push('Password')
  if (checks.length !== 0) throw new REGISTER_FAIL_ERROR(checks)

  const user = await User.findByUsername(username)

  if (user) {
    throw new DUPLICATED_VALUE_ERROR('User')
  }

  const hash = bcrypt.hashSync(password, 10)

  return User.create({ username, password: hash, active: true })
}

export async function login({ username, password }, { User }) {
  const user = await User.findByUsername(username)

  if (!user) throw new LOGIN_FAIL_ERROR(['Username'])
  if (!password || !bcrypt.compareSync(password, user.password)) throw new LOGIN_FAIL_ERROR(['Password'])

  const loginUser = {
    token: token({ userId: user.id, username: user.username, profile: user.profile }),
    id: user.id
  }
  return loginUser
}