import mongoose from 'mongoose'

import Dao from '../dao'

const UploadArticleSchema = new mongoose.Schema({
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

  serializer(data) {
    return {
      id: data.id,
      author: data.author,
      fileName: data.fileName,
      destination: data.destination,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      deletedAt: data.deletedAt,
    }
  }

  create({ author, date, fileName, destination }) {
    return UploadArticle.create({
      author,
      fileName,
      destination,
      createdAt: date,
      updatedAt: date,
    }).then(this.serializer)
  }
}
