import { ApolloServer } from 'apollo-server-express'
import rootTypeDefs from '../src/typedefs'
import { prepareResolver } from '../src/prepareResolver'
import rootPermission from '../src/permission'
import rootResolvers from '../src/resolvers'
import { context } from '../src/context'

const serverGraphql = new ApolloServer({
  typeDefs: rootTypeDefs,
  resolvers: prepareResolver(rootPermission, rootResolvers),
  context,
})

export function request({ query, variables }) {
  return serverGraphql.executeOperation({ query, variables })
}
