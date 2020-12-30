import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import { ApolloServer } from 'apollo-server-express'
import os from 'os'

import rootResolvers from './resolvers'
import rootPostResolvers from './postResolvers'
import rootPermission from './permission'
import rootTypeDefs from './typedefs'
import { prepareResolver } from './prepareResolver'

import './database/mongo/connection'
import context from './context'

const server = new ApolloServer({
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
)
expressServer.use(cors())
server.applyMiddleware({ app: expressServer, path })

const networkInterfaces = os.networkInterfaces()
const ip = networkInterfaces.en0.filter(en => en.family === 'IPv4')[0]['address']

expressServer.listen({ port: 5000 }, () =>
  // eslint-disable-next-line no-console
  console.log(`🚀 Server ready at http://${ip}:5000${server.graphqlPath}`)
)
