import { UNAUTHORIZED_ERROR, NOT_FOUND_ERROR } from '../../../error'

export async function auth({ id }, { Article, user }) {
  const article = await Article.findById(id)

  if (!article) {
    throw new NOT_FOUND_ERROR('article')
  }

  if (article.author.toString() !== user.id.toString()) {
    throw new UNAUTHORIZED_ERROR()
  }
}
