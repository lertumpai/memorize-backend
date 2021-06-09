import mongoose from 'mongoose'

import Dao from '../dao'
import { NOT_FOUND_ERROR } from '../../../error'

const ProfileSchema = new mongoose.Schema({
  name: String,
  birthday: Date,
  status: String,
  image: { type: mongoose.Types.ObjectId, ref: 'UploadProfile' },
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

  serializer(data) {
    return {
      id: data.id,
      username: data.username,
      password: data.password,
      active: data.active,
      profile: {
        name: data.profile.name,
        birthday: data.profile.name,
        status: data.profile.status,
        image: data.profile.image,
      },
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      deletedAt: data.deletedAt,
    }
  }

  findByUsername(username) {
    return User.findOne({ username }).then(this.serializer)
  }

  create({ username, password, date = new Date() }) {
    return User.create({ username, password, createdAt: date, updatedAt: date }).then(this.serializer)
  }

  async updateProfile(id, { name, birthday, status, image, date = new Date() }) {
    const user = await User.findById(id)

    if (!user) {
      throw new NOT_FOUND_ERROR('user')
    }

    user.profile.name = name || user.profile.name
    user.profile.birthday = birthday || user.profile.birthday
    user.profile.status = status || user.profile.status
    user.profile.image = image ? image.id : user.profile.image
    user.updated_time = date

    await this.clear(id)
    return user.save().then(this.serializer)
  }
}
