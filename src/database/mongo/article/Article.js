import mongoose from 'mongoose'
import Dao from '../dao'

const ArticleSchema = new mongoose.Schema({
  author: { type: mongoose.Types.ObjectId, ref: 'User', require: true },
  content: { type: String, require: true },
  image: { type: mongoose.Types.ObjectId, ref: 'UploadArticle' },
  createdAt: Date,
  updatedAt: Date,
  deletedAt: Date,
  active: { type: Boolean, default: true },
})

ArticleSchema.index({ active: 1, createdAt: -1 })
ArticleSchema.index({ active: 1, author: 1, createdAt: -1 })

const Article = mongoose.model('Article', ArticleSchema)

export default class ArticleClass extends Dao {
  constructor() {
    super(Article)
  }

  create({ author, content, image, date }) {
    return Article.create({ author, content, image, createdAt: date, updatedAt: date })
  }

  findAll({ author, active = true }, { after, before, limit = 10 }) {
    let filter = { active }

    if (author) {
      filter = { ...filter, author }
    }

    return this.queryAfterBeforeLimit(filter, { after, before, limit, sortBy: 'createdAt' })
  }

  async update(id, { content, image, date }) {
    const article = await Article.findById(id)

    article.content = content || article.content
    article.image = image ? image.id : article.image
    article.updatedAt = date

    await this.clear(id)
    const articlee = await article.save()
    console.log(articlee)
    return articlee
  }
}
