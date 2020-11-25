import { UNAUTHORIZED_ERROR } from '../../../error'

export async function auth({ id }, { Article, user }) {
  const article = await Article.findById(id)

  if (!article) {
    throw new UNAUTHORIZED_ERROR()
  }

  if (article.author.toString() !== user.userId.toString()) {
    throw new UNAUTHORIZED_ERROR()
  }
}