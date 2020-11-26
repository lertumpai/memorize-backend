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

async function generateArticles(n, users) {
  console.log('--- Start create articles ---')
  const articles = []
  const start = 0
  const end = start + n
  for (let i = start; i < end; i++) {
    const user = randomDocument(users)
    const content = generateString(15)
    articles.push({
      author: user.id,
      content: `content:${content}:${i}`,
      date: randomDate(),
    })
  }

  console.log('--- creating articles ---')
  const results = await Promise.all(articles.map(article => Article.create(article)))

  console.log('--- Finish create articles ---')
  return results
}

async function generateComments(n, users, articles) {
  console.log('--- Start create comments ---')
  const comments = []
  const start = 0
  const end = start + n

  articles.forEach(article => {
    for (let i = start; i < end; i++) {
      const user = randomDocument(users)
      const content = generateString(15)
      comments.push({
        author: user.id,
        articleId: article.id,
        content: `content:${content}:${i}`,
        date: randomDate(),
      })
    }
  })

  console.log('--- creating comments ---')
  const results = await Promise.all(comments.map(comment => Comment.create(comment)))

  console.log('--- Finish create comments ---')
  return results
}

async function main() {
  // eslint-disable-next-line no-empty
  while (mongoose.connection.readyState !== 1) {
    await new Promise(resolve => setTimeout(resolve, 1000))
  }

  const users = await generateUsers(10)
  const articles = await generateArticles(100, users)
  await generateComments(100, users, articles)
}

main()