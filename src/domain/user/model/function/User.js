import moment from 'moment'

import User from '../User'

export function findUserById(id) {
  return User.findById(id)
}

export function findUserByUsername(username) {
  return User.findOne({username})
}

export function createUser({username, password}) {
  const newUser = new User({username, password})
  return newUser.save()
}

export function createProfile(id, {name, birthday, status}) {
  return User.findOneAndUpdate(id, {profile: {name, birthday: moment(birthday).utc(), status}}, {new: true})
}

export function inActiveUser(id) {
  return User.findOneAndUpdate(id, {active: false}, {new: true})
}
