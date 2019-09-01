import express from 'express'
import bodyParser from 'body-parser'
import { ApolloServer, gql } from 'apollo-server-express'

// Construct a schema, using GraphQL schema language
const typeDefs = gql`
    type Query {
        hello: String
    }
`

// Provide resolver functions for your schema fields
const resolvers = {
  Query: {
    hello: () => 'Hello world!',
  },
}

const server = new ApolloServer({typeDefs, resolvers})

const expressServer = express()
const path = '/graphql'

expressServer.use(
  path,
  bodyParser.json({limit: 8}),
  bodyParser.urlencoded(),
)
server.applyMiddleware({ app: expressServer, path })

expressServer.listen({ port: 5000 }, () =>
  console.log(`🚀 Server ready at http://localhost:5000${server.graphqlPath}`)
)
