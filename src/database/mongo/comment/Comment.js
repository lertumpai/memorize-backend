import mongoose from 'mongoose'
import Dao from '../dao'
import { NOT_FOUND_ERROR } from '../../../error'

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
    return data ? {
      id: data.id,
      articleId: data.articleId,
      author: data.author,
      content: data.content,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      deletedAt: data.deletedAt,
      active: data.active,
    } : null
  }

  create({ author, articleId, content, date = new Date() }) {
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

    return Comment.countDocuments(filter)
  }

  async update(id, { content, date = new Date() }) {
    const comment = await Comment.findById(id)

    if (!comment) {
      throw new NOT_FOUND_ERROR('comment')
    }

    comment.content = content || comment.content
    comment.updatedAt = date

    await this.clear(id)
    return comment.save().then(this.serializer)
  }

  async deleteByArticle(articleId) {
    const deletedComments = await Comment.updateMany({ articleId }, { active: false }, { new: true })
    return deletedComments
  }
}
