/* eslint no-console:off */

import mongoose from '../database/mongo/connection'
import { register } from '../authentication'
import { User } from '../database/mongo/user'
import { Article, ArticleAction } from '../database/mongo/article'
import { Comment, CommentAction } from '../database/mongo/comment'

function randomDocument(doc) {
  return doc[Math.floor(Math.random() * doc.length)]
}

function randomDate() {
  const year = new Date().getFullYear() - 1
  const month = Math.floor(Math.random() * 12)
  const day = Math.floor(Math.random() * 30) + 1
  const hours = Math.floor(Math.random() * 24)
  const minutes = Math.floor(Math.random() * 60)
  const seconds = Math.floor(Math.random() * 60)
  return new Date(year, month, day, hours, minutes, seconds)
}

function generateString(n) {
  let result = ''
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789กขฃคฅฆงจฉชซฌญฎฏฐฑฒณดตถทธนบปผฝพฟภมยรลวศษสหฬอฮ'
  const charactersLength = characters.length
  for (let i = 0; i < n; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  return result
}

function clearMongo() {
  return mongoose.connection.dropDatabase()
}

async function generateUsers(n) {
  console.log('--- Start create users ---')
  const users = []
  const start = 0
  const end = start + n
  const name = 'user'
  const status = generateString(20)
  const pw = '123'
  for (let i = start; i < end; i++) {
    users.push({
      username: `${name}:${i}`,
      password: pw,
      profile: {
        name: `${name}:${i}`,
        birthday: randomDate(),
        status: `${status}:${i}`,
      },
      date: randomDate(),
    })
  }

  console.log('--- registering users ---')
  const registeredUsers = await Promise.all(users.map(user => register(user, { ...user, User })))

  console.log('--- updating users profile ---')
  const results = await Promise.all(
    registeredUsers.map((user, i) => {
      user.profile = users[i].profile
      return user.save()
    })
  )

  console.log('--- Finish create users ---')
  return results
}

function generateDocArticles(batch, users) {
  const articles = []
  for (let i = 0; i < batch; i++) {
    const user = randomDocument(users)
    const content = generateString(Math.random() * 300)
    articles.push({
      author: user.id,
      content: `article:content:${content}:${i}`,
      date: randomDate(),
    })
  }
  return articles
}

async function generateArticles(n, users) {
  console.log('--- Start create articles ---')
  const batch = 100
  let created = 0
  const results = []

  console.log('--- creating articles ---')
  while (created < n) {
    const toBeCreate = n - created
    const articles = generateDocArticles(batch > toBeCreate ? toBeCreate : batch, users)
    const createdArticles = await Promise.all(articles.map(article => Article.create(article)))
    created += createdArticles.length
    results.push(createdArticles)
    console.log(`Created article: ${created}`)
  }

  console.log('--- Finish create articles ---')
  return results.flat().map(article => article.id)
}

function generateDocComments(batch, users, article) {
  const comments = []
  for (let i = 0; i < batch; i++) {
    const user = randomDocument(users)
    const content = generateString(Math.random() * 150)
    comments.push({
      author: user.id,
      articleId: article,
      content: `comment:content:${content}:${i}`,
      date: randomDate(),
    })
  }
  return comments
}

async function generateComments(n, users, articles) {
  console.log('--- Start create comments ---')
  const batch = 100
  let articleN = 1
  const results = []

  console.log('--- creating comments ---')
  for(const article of articles) {
    let created = 0
    const randomN = Math.floor(Math.random() * n)
    while (created < randomN) {
      const toBeCreate = randomN - created
      const comments = generateDocComments(batch > toBeCreate ? toBeCreate : batch, users, article)
      const createdComments = await Promise.all(comments.map(comment => Comment.create(comment)))
      created += createdComments.length
      results.push(createdComments)
      console.log(`Created article: ${articleN} comments: ${created}`)
    }

    articleN++
  }

  console.log('--- Finish create comments ---')
  return results.flat().map(comment => comment.id)
}

async function randomArticleAction(articles, users) {
  console.log(`--- Start action articles: ${articles.length} articles ---`)
  for(const user of users) {
    console.log(`User action: ${user.id}`)
    await Promise.all(
      articles.map(articleId => {
        return Math.floor(Math.random() * 100) > 60
          ? ArticleAction.update({ articleId, authorId: user.id, action: 'like' })
          : null
      })
    )
  }
  console.log('--- Finish action articles ---')
}

async function randomCommentAction(comments, users) {
  console.log(`--- Start action comments: ${comments.length} comments ---`)
  for(const user of users) {
    console.log(`User action: ${user.id}`)
    await Promise.all(
      comments.map(commentId => {
        return Math.floor(Math.random() * 100) > 70
          ? CommentAction.update({ commentId, authorId: user.id, action: 'like' })
          : null
      })
    )
  }
  console.log('--- Finish action comments ---')
}

async function main() {
  // eslint-disable-next-line no-empty
  while (mongoose.connection.readyState !== 1) {
    await new Promise(resolve => setTimeout(resolve, 1000))
  }

  console.log('--- Start Clear database ---')
  await clearMongo()
  console.log('--- Finish Clear database ---')

  const users = await generateUsers(process.env.GENERATE_USERS)
  const articles = await generateArticles(process.env.GENERATE_ARTICLES, users)
  const comments = await generateComments(process.env.GENERATE_COMMENTS, users, articles)

  await randomArticleAction(articles, users)
  await randomCommentAction(comments, users)

  process.exit()
}

main()
