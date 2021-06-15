import nFormatter from '../../utils/nFormatter'
import { getImageUrl } from '../upload/utils/upload'

import {
  Article,
  UploadArticle,
  Comment,
  User,
  ArticleAction,
} from '../../database/mongo'

module.exports = {
  Query: {
    async article(_, { id }) {
      return Article.findById(id)
    },
    async articles(_, { author, pagination }) {
      return Article.findAll({ author }, pagination)
    },
  },
  Mutation: {
    async article(_, { id, input }, { user, date }) {
      const { content, image } = input

      let uploadedImage
      if (image) {
        uploadedImage = await UploadArticle.create({
          ...image,
          author: user.id,
          date,
        })
      }

      return id
        ? Article.update(id, { content, image: uploadedImage, date })
        : Article.create({ author: user.id, content, image: uploadedImage, date })
    },
    articleDelete(_, { id }, { date }) {
      return Article.deleteById(id, { date })
    },
  },
  Article: {
    author({ author }) {
      return User.findById(author)
    },
    async comment({ id }) {
      const commentCount = await Comment.count({ articleId: id })
      return nFormatter(commentCount)
    },
    canMutate({ author }, _, { user }) {
      return author.toString() === user.id.toString()
    },
    async action({ id }) {
      const articleActionCount = await ArticleAction.count({ articleId: id })
      return nFormatter(articleActionCount)
    },
    userAction({ id }, _, { user }) {
      return ArticleAction.findOneByArticleAuthor({ articleId: id, authorId: user.id })
    },
    async image({ image }) {
      if (!image) {
        return null
      }
      const articleImage = await UploadArticle.findById(image)
      const { fileName, destination } = articleImage
      return getImageUrl(fileName, destination)
    },
  },
  FeedArticle: {
    hasMore({ hasMore }) {
      return hasMore || false
    },
  },
}
