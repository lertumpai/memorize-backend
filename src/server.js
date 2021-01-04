import express from 'express'
import { createServer } from 'http'
import cors from 'cors'
import bodyParser from 'body-parser'
import { ApolloServer } from 'apollo-server-express'
import { Server } from 'socket.io'

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

expressServer.use(
  path,
  bodyParser.json({ limit: '8mb' }),
  bodyParser.urlencoded({ extended: true }),
  cors(),
)

expressServer.use(express.static('public'))

const server = createServer(expressServer)

const io = new Server(server, { path: '/graphql' })

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
