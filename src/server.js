import express from 'express'
import bodyParser from 'body-parser'
import { ApolloServer} from 'apollo-server-express'
import rootResolvers from './resolvers'
import rootPostResolvers from './postResolvers'
import rootTypeDefs from './typedefs'

const server = new ApolloServer({typeDefs: rootTypeDefs, resolvers: [rootResolvers, rootPostResolvers]})

const expressServer = express()
const path = '/graphql'

expressServer.use(
  path,
  bodyParser.json({limit: '8mb'}),
  bodyParser.urlencoded(),
)
server.applyMiddleware({ app: expressServer, path })

expressServer.listen({ port: 5000 }, () =>
  console.log(`🚀 Server ready at http://localhost:5000${server.graphqlPath}`)
)
