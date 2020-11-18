import mongoose from 'mongoose'

const Schema = mongoose.Schema

const schemaArticle = new mongoose.Schema({
    author: { type: Schema.ObjectId, ref: 'User' },
    content: String,
    created_time: Date,
})

schemaArticle.index({created_time: 1})

export default mongoose.model('Article', schemaArticle)