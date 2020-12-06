import bcrypt from 'bcrypt'

import { DUPLICATED_VALUE_ERROR, LOGIN_FAIL_ERROR, REGISTER_FAIL_ERROR } from '../error'

export async function register({ username, password }, { User, date }) {
  const checks = []
  if (!username) checks.push('username')
  if (!password) checks.push('password')
  if (checks.length !== 0) throw new REGISTER_FAIL_ERROR(checks)

  const user = await User.findByUsername(username)

  if (user) {
    throw new DUPLICATED_VALUE_ERROR('username')
  }

  const hash = bcrypt.hashSync(password, 10)
  return User.create({ username, password: hash, active: true, date })
}

export async function login({ username, password }, { User }) {
  const user = await User.findByUsername(username)

  if (!user) throw new LOGIN_FAIL_ERROR(['username'])
  if (!password || !bcrypt.compareSync(password, user.password)) throw new LOGIN_FAIL_ERROR(['password'])

  return user
}
