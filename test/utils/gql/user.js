import { gql } from 'apollo-server-express'

export const UserFragment = gql`
  fragment UserFragment on User {
    id
    token
    profile {
      status
      name
      birthday
      image
    }
  }
`
