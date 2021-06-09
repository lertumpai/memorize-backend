import mongoose from 'mongoose'
import Dao from '../dao'

const CommentActionSchema = new mongoose.Schema({
  commentId: { type: mongoose.Types.ObjectId, ref: 'Comment', require: true },
  authorId: { type: mongoose.Types.ObjectId, ref: 'User', require: true },
  action: { type: String, enum: ['like'], require: true },
})

CommentActionSchema.index({ commentId: 1, authorId: 1 }, { unique: true })

const CommentAction = mongoose.model('CommentAction', CommentActionSchema)

export default class CommentActionClass extends Dao {
  constructor() {
    super(CommentAction)
  }

  serializer(data) {
    return {
      id: data.id,
      commentId: data.commentId,
      authorId: data.authorId,
      action: data.action,
    }
  }

  findOneByCommentAuthor({ commentId, authorId }) {
    return CommentAction.findOne({ commentId, authorId }).then(this.serializer)
  }

  async update({ authorId, commentId, action }) {
    const filter = { authorId, commentId }

    if (action === 'unlike') {
      await CommentAction.findOneAndDelete(filter)
      return null
    }

    const update = { ...filter, action }
    return CommentAction.findOneAndUpdate(filter, update, { upsert: true, new: true }).then(this.serializer)
  }

  count({ authorId, commentId }) {
    let filter = { commentId }

    if (authorId) {
      filter = { ...filter, authorId }
    }

    return CommentAction.countDocuments(filter)
  }
}
