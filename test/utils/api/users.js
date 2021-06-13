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

function getContext(user) {
  return {
    user,
    date: new Date(),
    io: {
      emit: () => null,
    },
  }
}

export async function createUserA() {
  const user = await register({
    username: users.userA.username,
    password: users.userA.password,
  }, { date: new Date() })
  return {
    ...user,
    context: getContext(user),
  }
}

export async function createUserB() {
  const user = await register({
    username: users.userB.username,
    password: users.userB.password,
  }, { date: new Date() })
  return {
    ...user,
    context: getContext(user),
  }
}
