import mongoose from 'mongoose'

import Dao from '../dao'

const UploadProfileSchema = new mongoose.Schema({
  author: { type: mongoose.Types.ObjectId, ref: 'User', require: true },
  fileName: String,
  destination: String,
  createdAt: Date,
  updatedAt: Date,
  deletedAt: Date,
})

const UploadProfile = mongoose.model('UploadProfile', UploadProfileSchema)

export default class UploadProfileClass extends Dao {
  constructor() {
    super(UploadProfile)
  }

  serializer(data) {
    return {
      id: data?.id,
      author: data?.author,
      fileName: data?.fileName,
      destination: data?.destination,
      createdAt: data?.createdAt,
      updatedAt: data?.updatedAt,
      deletedAt: data?.deletedAt,
    }
  }

  create({ author, date, fileName, destination }) {
    return UploadProfile.create({
      author,
      fileName,
      destination,
      createdAt: date,
      updatedAt: date,
    }).then(this.serializer)
  }
}
