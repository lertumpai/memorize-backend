import mongoose from 'mongoose'
import moment from 'moment'
import Dao from '../dao'

const CommentSchema = new mongoose.Schema({
  article: { type: mongoose.Types.ObjectId, ref: 'Article' },
  author: { type: mongoose.Types.ObjectId, ref: 'User' },
  content: String,
  created_time: Date,
  updated_time: Date,
  active: { type: Boolean, default: true },
})

const Comment = mongoose.model('Comment', CommentSchema)

export default class CommentClass extends Dao {
  constructor() {
    super(Comment)
  }

  create({ author, article, content }) {
    const newComment = new Comment({ author, article, content, created_time: moment().utc() })
    return newComment.save()
  }

  update(id, { content }) {
    return Comment.findOneAndUpdate(id, { content }, { new: true })
  }

  deleteById(id) {
    return Comment.findOneAndDelete(id)
  }

  deleteByArticle(article) {
    return Comment.deleteMany({ article })
  }
}