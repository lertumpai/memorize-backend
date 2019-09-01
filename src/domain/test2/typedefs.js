import {gql} from 'apollo-server-express'

const typeDefs = gql`
    extend type Query {
        sum: Float
    },
    extend type Mutation {
        multiple: Float
    }
`

module.exports = typeDefs
