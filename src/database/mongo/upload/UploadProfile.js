import mongoose from 'mongoose'

import Dao from '../dao'

const UploadProfileSchema = new mongoose.Schema({
  image: { type: String, unique: true },
  author: { type: mongoose.Types.ObjectId, ref: 'User', require: true },
  createdAt: Date,
  updatedAt: Date,
  deletedAt: Date,
})

const UploadProfile = mongoose.model('UploadProfile', UploadProfileSchema)

export default class UploadProfileClass extends Dao {
  constructor() {
    super(UploadProfile)
  }

  create({ author, image, date }) {
    return UploadProfile.create({ author, image, createdAt: date, updatedAt: date })
  }
}
