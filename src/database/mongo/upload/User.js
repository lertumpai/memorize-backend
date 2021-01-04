import mongoose from 'mongoose'

import Dao from '../dao'

const UploadProfileSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  password: String,
  createdAt: Date,
  updatedAt: Date,
  deletedAt: Date,
})

const UploadProfile = mongoose.model('UploadProfile', UploadProfileSchema)

export default class UserClass extends Dao {
  constructor() {
    super(UploadProfile)
  }
}
