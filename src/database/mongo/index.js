import ArticleClass from './article/Article'
const Article = new ArticleClass()

import ArticleActionClass from './article/ArticleAction'
const ArticleAction = new ArticleActionClass()

import CommentClass from './comment/Comment'
const Comment = new CommentClass()

import CommentActionClass from './comment/CommentAction'
const CommentAction = new CommentActionClass()

import UploadProfileClass from './upload/UploadProfile'
const UploadProfile = new UploadProfileClass()

import UploadArticleClass from './upload/UploadArticle'
const UploadArticle = new UploadArticleClass()

import UserClass from './user/User'
const User = new UserClass()

export {
  Article,
  ArticleAction,
  Comment,
  CommentAction,
  UploadArticle,
  UploadProfile,
  User,
}
