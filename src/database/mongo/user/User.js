import mongoose from 'mongoose'
import Dao from '../dao'
import { NOT_FOUND_ERROR } from '../../../error'

const ProfileSchema = new mongoose.Schema({
  name: String,
  birthday: Date,
  status: String
}, { _id: false })

const UserSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  password: String,
  active: { type: Boolean, default: true },
  profile: {
    type: ProfileSchema,
    default: {}
  },
  created_time: Date,
  updated_time: Date,
})

const User = mongoose.model('User', UserSchema)

export default class UserClass extends Dao {
  constructor() {
    super(User)
  }

  findByUsername(username) {
    return User.findOne({ username })
  }

  create({ username, password, date }) {
    const newUser = new User({ username, password, created_time: date, updated_time: date })
    return newUser.save()
  }

  async updateProfile(id, { name, birthday, status, date }) {
    const user = await User.findById(id)

    if (!user) {
      throw new NOT_FOUND_ERROR('user')
    }

    user.profile.name = name || user.profile.name
    user.profile.birthday = birthday || user.profile.birthday
    user.profile.status = status || user.profile.status
    user.updated_time = date

    return user.save()
  }
}