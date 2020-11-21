import mongoose from 'mongoose'
import Dao from '../dao'
import moment from 'moment'

const schemaUser = new mongoose.Schema({
  username: { type: String, unique: true },
  password: String,
  active: Boolean,
  profile: {
    type: {
      name: String,
      birthday: Date,
      status: String
    },
    default: null
  }
})

const User = mongoose.model('User', schemaUser)

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

  inActiveUser(id) {
    return User.findOneAndUpdate(id, { active: false }, { new: true })
  }
}