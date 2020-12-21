import mongoose from 'mongoose'
import Dao from '../dao'

const ArticleActionSchema = new mongoose.Schema({
  articleId: { type: mongoose.Types.ObjectId, ref: 'Article', require: true },
  author: { type: mongoose.Types.ObjectId, ref: 'User', require: true },
  action: { type: String, enum: ['like', 'unlike'], require: true },
}, { _id: false })

ArticleActionSchema.index({ articleId: 1, author: 1, action: 1 }, { unique: true })

const ArticleAction = mongoose.model('ArticleAction', ArticleActionSchema)

export default class ArticleActionClass extends Dao {
  constructor() {
    super(ArticleAction)
  }

  update({ author, articleId, action }) {
    const filter = { author, articleId }
    const update = { ...filter, action }
    return ArticleAction.findOneAndUpdate(filter, update, { upsert: true, new: true })
  }

  count({ author, articleId }) {
    let filter = { articleId, action: { $ne: 'unlike' } }

    if (author) {
      filter = { ...filter, author }
    }

    return ArticleAction.countDocuments(filter)
  }
}