import { ApolloServer } from 'apollo-server-express'
import rootTypeDefs from '../src/typedefs'
import { prepareResolver } from '../src/prepareResolver'
import rootPermission from '../src/permission'
import rootResolvers from '../src/resolvers'
import rootPostResolvers from '../src/postResolvers'

const serverGraphql = new ApolloServer({
  typeDefs: rootTypeDefs,
  resolvers: prepareResolver(rootPermission, rootResolvers, rootPostResolvers),
  context: () => ({ user: null }),
})

export function request({ query, variables }) {
  return serverGraphql.executeOperation({ query, variables })
}
