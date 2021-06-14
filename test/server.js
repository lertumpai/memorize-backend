import { ApolloServer } from 'apollo-server-express'
import { createTestClient } from 'apollo-server-testing'

import rootTypeDefs from '../src/typedefs'
import { prepareResolver } from '../src/prepareResolver'
import rootPermission from '../src/permission'
import rootResolvers from '../src/resolvers'
import rootPostResolvers from '../src/postResolvers'

export async function requestQuery({ schema, variables }, { context }) {
  const defaultContext = () => ({ user: null })
  const serverGraphql = new ApolloServer({
    typeDefs: rootTypeDefs,
    resolvers: prepareResolver(rootPermission, rootResolvers, rootPostResolvers),
    context: context || defaultContext,
  })

  const { query } = createTestClient(serverGraphql)
  const res = await query({ query: schema, variables })

  if (res.errors) {
    throw res.errors[0]
  }

  return res.data
}

export async function requestMutation({ schema, variables }, { context }) {
  const defaultContext = () => ({ user: null })
  const serverGraphql = new ApolloServer({
    typeDefs: rootTypeDefs,
    resolvers: prepareResolver(rootPermission, rootResolvers, rootPostResolvers),
    context: context || defaultContext,
  })

  const { mutate } = createTestClient(serverGraphql)
  const res = await mutate({ mutation: schema, variables })

  if (res.errors) {
    throw res.errors[0]
  }

  return res.data
}
