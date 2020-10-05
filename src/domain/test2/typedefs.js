import {gql} from 'apollo-server-express'

const typeDefs = gql`
    extend type Query {
        sum(x: Float, y: Float): Float
    },
    extend type Mutation {
        multiple: Float
    }
`

module.exports = typeDefs
