import mongoose from 'mongoose'
import Dao from '../dao'

const ArticleLikeSchema = new mongoose.Schema({
  articleId: { type: mongoose.Types.ObjectId, ref: 'Article', require: true },
  author: { type: mongoose.Types.ObjectId, ref: 'User', require: true },
})

ArticleLikeSchema.index({ articleId: 1, author: 1 })

const ArticleLike = mongoose.model('ArticleLike', ArticleLikeSchema)

export default class ArticleLikeClass extends Dao {
  constructor() {
    super(ArticleLike)
  }

  async upsert({ author, articleId }) {
    const countAuthorLike = ArticleLike.countDocuments({ articleId, author })

    if (countAuthorLike > 0) {
      const deleted = await ArticleLike.findOneAndDelete()
      console.log(deleted)
      return null
    }

    return ArticleLike.create({ author, articleId })
  }
}