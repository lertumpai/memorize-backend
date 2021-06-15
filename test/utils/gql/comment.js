import { gql } from 'apollo-server-express'

export const CommentFragment = gql`
  fragment CommentFragment on Comment {
    id
    author {
      id
    }
    article {
      id
    }
    content
    active
    userAction {
      ... on CommentAction {
        action
        authorId
        commentId
      }
    }
    action
    canMutate
    createdAt
    updatedAt
    deletedAt
  }
`
