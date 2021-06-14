import {
  Article,
  ArticleAction,
} from '../../../src/database/mongo'

export function createArticle({ author, content = 'content', image }) {
  return Article.create({ author, content, image })
}

export function actionArticle({ authorId, articleId, action = 'like' }) {
  return ArticleAction.update({ authorId, articleId, action })
}
