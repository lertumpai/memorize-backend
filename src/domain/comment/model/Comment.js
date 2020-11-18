import mongoose from 'mongoose'

const Schema = mongoose.Schema

const schemaComment = new mongoose.Schema({
  article: { type: Schema.ObjectId, ref: 'Article' },
  author: { type: Schema.ObjectId, ref: 'User' },
  content: String,
  created_time: Date,
})

schemaComment.index({article: 1, created_time: 1})

export default mongoose.model('Comment', schemaComment)