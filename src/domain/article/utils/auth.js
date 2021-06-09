import { UNAUTHORIZED_ERROR, NOT_FOUND_ERROR } from '../../../error'

import {
  Article,
} from '../../../database/mongo'

export async function authArticle(id, user) {
  const article = await Article.findById(id)

  if (!article) {
    throw new NOT_FOUND_ERROR('article')
  }

  if (article.author.toString() !== user.id.toString()) {
    throw new UNAUTHORIZED_ERROR()
  }

  return true
}
