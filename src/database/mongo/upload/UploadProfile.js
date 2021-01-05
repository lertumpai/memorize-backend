import mongoose from 'mongoose'

import Dao from '../dao'

const UploadProfileSchema = new mongoose.Schema({
  urlImage: { type: String, unique: true },
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

  create({ author, urlImage, date, fileName, destination }) {
    return UploadProfile.create({
      author,
      urlImage,
      fileName,
      destination,
      createdAt: date,
      updatedAt: date,
    })
  }

  async getUrlImageById(id) {
    const image = await this.findById(id)
    return image ? image.urlImage : null
  }
}
