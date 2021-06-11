import {
  Article,
  ArticleAction,
} from '../../../src/database/mongo'

export function createArticle({ author, content = 'content', image }) {
  return Article.create({ author, content, image })
}

export function createArticles({ author, content = 'content', image }, { size = 10 }) {
  return Promise.all([...Array(size).keys()].map(() => createArticle({ author, content, image })))
}

export function actionArticle({ authorId, articleId, action = 'like' }) {
  return ArticleAction.update({ authorId, articleId, action })
}
