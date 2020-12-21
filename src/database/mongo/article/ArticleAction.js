import mongoose from 'mongoose'
import Dao from '../dao'

const ArticleActionSchema = new mongoose.Schema({
  articleId: { type: mongoose.Types.ObjectId, ref: 'Article', require: true },
  authorId: { type: mongoose.Types.ObjectId, ref: 'User', require: true },
  action: { type: String, enum: ['like'], require: true },
})

ArticleActionSchema.index({ articleId: 1, authorId: 1 }, { unique: true })

const ArticleAction = mongoose.model('ArticleAction', ArticleActionSchema)

export default class ArticleActionClass extends Dao {
  constructor() {
    super(ArticleAction)
  }

  findOneByArticleAuthor({ articleId, authorId }) {
    return ArticleAction.findOne({ articleId, authorId })
  }

  async update({ authorId, articleId, action }) {
    const filter = { authorId, articleId }

    if (action === 'unlike') {
      await ArticleAction.findOneAndDelete(filter)
      return null
    }

    const update = { ...filter, action }
    return ArticleAction.findOneAndUpdate(filter, update, { upsert: true, new: true })
  }

  count({ authorId, articleId }) {
    let filter = { articleId, action: { $ne: 'unlike' } }

    if (authorId) {
      filter = { ...filter, authorId }
    }

    return ArticleAction.countDocuments(filter)
  }
}
