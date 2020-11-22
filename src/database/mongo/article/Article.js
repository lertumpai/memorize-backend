import mongoose from 'mongoose'
import Dao from '../dao'

const ArticleSchema = new mongoose.Schema({
  author: { type: mongoose.Types.ObjectId, ref: 'User', require: true },
  content: { type: String, require: true },
  created_time: Date,
  updated_time: Date,
  active: { type: Boolean, default: true },
})

ArticleSchema.index({ active: 1, created_time: 1 })

const Article = mongoose.model('Article', ArticleSchema)

export default class ArticleClass extends Dao {
  constructor() {
    super(Article)
  }

  create({ author, content, date }) {
    return Article.create({ author, content, created_time: date, updated_time: date })
  }

  update(id, { content }) {
    return Article.findOneAndUpdate(id, { content }, { new: true })
  }
}