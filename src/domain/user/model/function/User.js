import moment from 'moment'

import User from '../User'

export function findById(id) {
  return User.findById(id)
}

export function findByUsername(username) {
  return User.findOne({ username })
}

export function create({ username, password }) {
  const newUser = new User({ username, password })
  return newUser.save()
}

export function createProfile(id, { name, birthday, status }) {
  return User.findOneAndUpdate(id, { profile: { name, birthday: moment(birthday).utc(), status } }, { new: true })
}

export function inActiveUser(id) {
  return User.findOneAndUpdate(id, { active: false }, { new: true })
}
