import mongoose from 'mongoose'
import Dao from '../dao'

const CommentSchema = new mongoose.Schema({
  articleId: { type: mongoose.Types.ObjectId, ref: 'Article' },
  author: { type: mongoose.Types.ObjectId, ref: 'User' },
  content: { type: String, require: true },
  createdAt: Date,
  updatedAt: Date,
  deletedAt: Date,
  active: { type: Boolean, default: true },
})

CommentSchema.index({ active: 1, articleId: 1, createdAt: -1 })

const Comment = mongoose.model('Comment', CommentSchema)

export default class CommentClass extends Dao {
  constructor() {
    super(Comment)
  }

  serializer(data) {
    return {
      id: data.id,
      articleId: data.articleId,
      author: data.author,
      content: data.content,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      deletedAt: data.deletedAt,
      active: data.active,
    }
  }

  create({ author, articleId, content, date }) {
    return Comment.create({ author, articleId, content, createdAt: date, updatedAt: date }).then(this.serializer)
  }

  findAll({ articleId, active = true }, { after, before, limit = 10 }) {
    let filter = { active }

    if (articleId) {
      filter = { ...filter, articleId }
    }

    return this.queryAfterBeforeLimit(filter, { after, before, limit, sortBy: 'createdAt' })
  }

  count({ articleId, active = true }) {
    let filter = { active }

    if (articleId) {
      filter = { ...filter, articleId }
    }

    return Comment.countDocuments(filter).then(this.serializer)
  }

  async update(id, { content, date }) {
    await this.clear(id)
    return Comment.findOneAndUpdate({ _id: id }, { content, updatedAt: date }, { new: true }).then(this.serializer)
  }

  async deleteByArticle(articleId) {
    const deletedComments = await Comment.updateMany({ articleId }, { active: false }, { new: true })
    return deletedComments.map(this.serializer())
  }
}
