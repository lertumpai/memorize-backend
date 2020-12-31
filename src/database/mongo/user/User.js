import mongoose from 'mongoose'

import Dao from '../dao'
import { NOT_FOUND_ERROR } from '../../../error'

const ProfileSchema = new mongoose.Schema({
  name: String,
  birthday: Date,
  status: String,
}, { _id: false })

const UserSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  password: String,
  active: { type: Boolean, default: true },
  profile: {
    type: ProfileSchema,
    default: {},
  },
  createdAt: Date,
  updatedAt: Date,
  deletedAt: Date,
})

const User = mongoose.model('User', UserSchema)

export default class UserClass extends Dao {
  constructor() {
    super(User)
  }

  findByUsername(username) {
    return User.findOne({ username })
  }

  create({ username, password, date = new Date() }) {
    return User.create({ username, password, createdAt: date, updatedAt: date })
  }

  async updateProfile(id, { name, birthday, status, date = new Date() }) {
    const user = await User.findById(id)

    if (!user) {
      throw new NOT_FOUND_ERROR('user')
    }

    user.profile.name = name || user.profile.name
    user.profile.birthday = birthday || user.profile.birthday
    user.profile.status = status || user.profile.status
    user.updated_time = date

    await this.clear(id)
    return user.save()
  }
}
