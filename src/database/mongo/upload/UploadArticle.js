import mongoose from 'mongoose'

import Dao from '../dao'

const UploadArticleSchema = new mongoose.Schema({
  urlImage: { type: String, unique: true },
  author: { type: mongoose.Types.ObjectId, ref: 'User', require: true },
  fileName: String,
  destination: String,
  createdAt: Date,
  updatedAt: Date,
  deletedAt: Date,
})

const UploadArticle = mongoose.model('UploadArticle', UploadArticleSchema)

export default class UploadArticleClass extends Dao {
  constructor() {
    super(UploadArticle)
  }

  create({ author, urlImage, date, fileName, destination }) {
    return UploadArticle.create({
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
