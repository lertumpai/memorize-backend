/* eslint no-console:off */

import mongoose from '../database/mongo/connection'
import { register } from '../authentication'
import { User } from '../database/mongo/user'
import { Article } from '../database/mongo/article'
import { Comment } from '../database/mongo/comment'

function randomDocument(doc) {
  return doc[Math.floor(Math.random() * doc.length)]
}

function randomDate() {
  const year = 1980 + Math.floor(Math.random() * 30)
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

async function generateUsers(n) {
  console.log('--- Start create users ---')
  const users = []
  const start = 0
  const end = start + n
  const name = generateString(7)
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
    const articles = generateDocArticles(batch, users)
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
    const content = generateString(15)
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
  let articleN = 0

  console.log('--- creating comments ---')
  for(const article of articles) {
    let created = 0
    while (created < n) {
      const comments = generateDocComments(batch, users, article)
      const createdComments = await Promise.all(comments.map(comment => Comment.create(comment)))
      created += createdComments.length
      console.log(`Created article: ${articleN} comments: ${created}`)
    }

    articleN++
  }

  console.log('--- Finish create comments ---')
}

async function main() {
  // eslint-disable-next-line no-empty
  while (mongoose.connection.readyState !== 1) {
    await new Promise(resolve => setTimeout(resolve, 1000))
  }

  const users = await generateUsers(process.env.GENERATE_USERS)
  const articles = await generateArticles(process.env.GENERATE_ARTICLES, users)
  await generateComments(process.env.GENERATE_COMMENTS, users, articles)

  process.exit()
}

main()