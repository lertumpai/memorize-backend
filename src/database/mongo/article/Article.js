import mongoose from 'mongoose'
import moment from 'moment'
import Dao from '../dao'

const ArticleSchema = new mongoose.Schema({
  author: { type: mongoose.Types.ObjectId, ref: 'User' },
  content: String,
  created_time: Date,
  updated_time: Date,
  active: { type: Boolean, default: true },
})

const Article = mongoose.model('Article', ArticleSchema)

export default class ArticleClass extends Dao {
  constructor() {
    super(Article)
  }

  create({ author, content }) {
    const newArticle = new Article({ author, content, created_time: moment().utc() })
    return newArticle.save()
  }

  update(id, { content }) {
    return Article.findOneAndUpdate(id, { content }, { new: true })
  }

  deleteArticle(id) {
    return Article.findOneAndDelete(id)
  }
}