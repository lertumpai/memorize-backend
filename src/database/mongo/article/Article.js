import mongoose from 'mongoose'
import Dao from '../dao'

const ArticleSchema = new mongoose.Schema({
  author: { type: mongoose.Types.ObjectId, ref: 'User', require: true },
  content: { type: String, require: true },
  createdAt: Date,
  updatedAt: Date,
  deletedAt: Date,
  active: { type: Boolean, default: true },
})

ArticleSchema.index({ active: 1, createdAt: 1 })

const Article = mongoose.model('Article', ArticleSchema)

export default class ArticleClass extends Dao {
  constructor() {
    super(Article)
  }

  create({ author, content, date }) {
    return Article.create({ author, content, createdAt: date, updatedAt: date })
  }

  async update(id, { content, date }) {
    return Article.findOneAndUpdate({ _id: id }, { content, updatedAt: date }, { new: true })
  }
}