import nFormatter from '../../utils/nFormatter'
import { acknowledge } from '../upload/utils/acknowledge'

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
        const res = await acknowledge(image)
        const acknowledged = await res.json()
        uploadedImage = await UploadArticle.create({
          ...acknowledged,
          author: user.id,
          date,
        })
      }

      return id
        ? Article.update(id, { content, image: uploadedImage?.id, date })
        : Article.create({ author: user.id, content, image: uploadedImage?.id, date })
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
      return UploadArticle.getUrlImageById(image)
    },
  },
}
