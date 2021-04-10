import express from 'express'
import { createServer } from 'http'
import cors from 'cors'
import bodyParser from 'body-parser'
import { ApolloServer } from 'apollo-server-express'
import redisAdapter from 'socket.io-redis'
import { Server } from 'socket.io'

import Upload from './domain/upload'

import rootResolvers from './resolvers'
import rootPostResolvers from './postResolvers'
import rootPermission from './permission'
import rootTypeDefs from './typedefs'
import { prepareResolver } from './prepareResolver'

import './database/mongo/connection'
import context from './context'

const serverGraphql = new ApolloServer({
  typeDefs: rootTypeDefs,
  resolvers: prepareResolver(rootPermission, rootResolvers, rootPostResolvers),
  context,
})

const expressServer = express()
const path = '/graphql'

const corsOptions = {
  credentials: true,
  origin: (origin, callback) => {
    return callback(null, true)
  },
}

expressServer.options('*', cors())
expressServer.use(
  cors(corsOptions),
  bodyParser.json({ limit: '15mb' }),
  bodyParser.urlencoded({ extended: true }),
)

expressServer.use('/upload', Upload)

const server = createServer(expressServer)

const io = new Server(server, { path })
io.adapter(redisAdapter({
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379,
}))

// Add socket.io
expressServer.use((req, res, next) => {
  req.io = io
  next()
})

serverGraphql.applyMiddleware({ app: expressServer, path })

server.listen({ port: 5000 }, () =>
  // eslint-disable-next-line no-console
  console.log(`🚀 Server ready at http://localhost:5000${serverGraphql.graphqlPath}`)
)
