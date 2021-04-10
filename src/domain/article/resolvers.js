import nFormatter from '../../utils/nFormatter'
import { getImageUrl } from '../upload/utils/upload'

module.exports = {
  Query: {
    article(_, { id }, { Article }) {
      return Article.findById(id)
    },
    async articles(_, { author, pagination }, { Article }) {
      return Article.findAll({ author }, pagination)
    },
  },
  Mutation: {
    async article(_, { id, input }, { Article, UploadArticle, user, date }) {
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
    articleDelete(_, { id }, { Article, date }) {
      return Article.deleteById(id, { date })
    },
  },
  Article: {
    author({ author }, _, { User }) {
      return User.findById(author)
    },
    async comment({ id }, _, { Comment }) {
      const commentCount = await Comment.count({ articleId: id })
      return nFormatter(commentCount)
    },
    canMutate({ author }, _, { user }) {
      return author.toString() === user.id.toString()
    },
    async action({ id }, _, { ArticleAction }) {
      const articleActionCount = await ArticleAction.count({ articleId: id })
      return nFormatter(articleActionCount)
    },
    userAction({ id }, _, { ArticleAction, user }) {
      return ArticleAction.findOneByArticleAuthor({ articleId: id, authorId: user.id })
    },
    async image({ image }, _, { UploadArticle }) {
      if (!image) {
        return null
      }
      const articleImage = await UploadArticle.findById(image)
      const { fileName, destination } = articleImage
      return getImageUrl(fileName, destination)
    },
  },
}
