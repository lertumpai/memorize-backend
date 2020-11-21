import mongoose from 'mongoose'
import Dao from '../dao'
import moment from 'moment'

const UserSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  password: String,
  active: { type: Boolean, default: true },
  profile: {
    type: {
      name: String,
      birthday: Date,
      status: String
    },
    default: null
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

  create({ username, password }) {
    const newUser = new User({ username, password })
    return newUser.save()
  }

  createOrUpdateProfile(id, { name, birthday, status }) {
    return User.findOneAndUpdate(id, { profile: { name, birthday: moment(birthday).utc(), status } }, { new: true })
  }
}