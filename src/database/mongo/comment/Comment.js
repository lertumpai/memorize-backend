import mongoose from 'mongoose'
import Dao from '../dao'

const CommentSchema = new mongoose.Schema({
  article: { type: mongoose.Types.ObjectId, ref: 'Article' },
  author: { type: mongoose.Types.ObjectId, ref: 'User' },
  content: { type: String, require: true },
  createdAt: Date,
  updatedAt: Date,
  deletedAt: Date,
  active: { type: Boolean, default: true },
})

CommentSchema.index({ active: 1, article: 1, createdAt: -1 })

const Comment = mongoose.model('Comment', CommentSchema)

export default class CommentClass extends Dao {
  constructor() {
    super(Comment)
  }

  create({ author, article, content, date }) {
    return Comment.create({ author, article, content, createdAt: date, updatedAt: date })
  }

  findAll({ article, active = true }, { after, before, limit = 10 }) {
    let filter = { active }

    if (article) {
      filter = { ...filter, article }
    }

    return this.queryAfterBeforeLimit(filter, { after, before, limit, sortBy: 'createdAt' })
  }

  update(id, { content, date }) {
    return Comment.findOneAndUpdate({ _id: id }, { content, updatedAt: date }, { new: true })
  }

  deleteByArticle(article) {
    return Comment.findOneAndUpdate({ article }, { active: false }, { new: true })
  }
}