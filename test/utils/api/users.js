import mongoose from 'mongoose'
import {
  register,
} from '../../../src/authentication'

export const users = {
  userA: {
    username: 'usernameA',
    password: 'password',
    profile: {
      name: 'name A',
      birthday: new Date('1996-06-10'),
      status: 'status A',
      image: { id: mongoose.Types.ObjectId() },
    },
  },
  userB: {
    username: 'usernameB',
    password: 'password',
    profile: {
      name: 'name B',
      birthday: new Date('1997-03-15'),
      status: 'status B',
    },
  },
}

export function createUserA() {
  return register({
    username: users.userA.username,
    password: users.userA.password,
  }, { date: new Date() })
}

export function createUserB() {
  return register({
    username: users.userB.username,
    password: users.userB.password,
  }, { date: new Date() })
}
