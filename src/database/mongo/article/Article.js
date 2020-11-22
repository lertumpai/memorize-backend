import mongoose from 'mongoose'
import Dao from '../dao'

const ArticleSchema = new mongoose.Schema({
  author: { type: mongoose.Types.ObjectId, ref: 'User', require: true },
  content: { type: String, require: true },
  created_time: Date,
  updated_time: Date,
  active: { type: Boolean, default: true },
})

const Article = mongoose.model('Article', ArticleSchema)

export default class ArticleClass extends Dao {
  constructor() {
    super(Article)
  }

  create({ author, content, date }) {
    const newArticle = new Article({ author, content, created_time: date, updated_time: date })
    return newArticle.save()
  }

  update(id, { content }) {
    return Article.findOneAndUpdate(id, { content }, { new: true })
  }

  deleteArticle(id) {
    return Article.findOneAndDelete(id)
  }
}