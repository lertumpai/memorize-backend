import { gql } from 'apollo-server-express'

export const ArticleFragment = gql`
  fragment ArticleFragment on Article {
    id
    author {
      id
    }
    content
    image
    active
    userAction {
      ... on ArticleAction {
        articleId
        authorId
        action
      }
    }
    action
    comment
    canMutate
    createdAt
    updatedAt
    deletedAt
  }
`
