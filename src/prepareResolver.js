import { UNAUTHORIZED_ERROR } from './error'

export function prepareResolver(permissions, resolvers, postResolvers) {
  return Object.keys(resolvers).reduce((result, quration) => {
    switch (quration) {
    case 'Query':
    case 'Mutation':
      return {
        ...result,
        [quration]: Object.keys(resolvers[quration]).reduce((result, keyResolver) => {
          return {
            ...result,
            [keyResolver]: prepareAndWrap(quration, keyResolver, permissions[quration][keyResolver], resolvers[quration][keyResolver], postResolvers),
          }
        }, {}),
      }

    default:
      return {
        ...result,
        [quration]: resolvers[quration],
      }
    }
  }, {})
}

function userPermission(user, quration, keyResolver) {
  if (user) {
    return true
  }

  if (quration === 'Query') {
    if (['login', 'version'].includes(keyResolver)) {
      return true
    }
  }
  else if (quration === 'Mutation') {
    if (['user'].includes(keyResolver)) {
      return true
    }
  }

  throw new UNAUTHORIZED_ERROR()
}

export function prepareAndWrap(quration, keyResolver, permission, resolver, postResolvers) {
  return async (...args) => {
    userPermission(args[2].user, quration, keyResolver)

    if (permission && typeof permission === 'function') {
      await permission(...args)
    }

    const res = await resolver(...args)
    console.log('res', res)

    const preparePostResolvers = Object.values(postResolvers).map(postResolver => {
      return postResolver[quration] && typeof postResolver[quration][keyResolver] === 'function'
        ? postResolver[quration][keyResolver]
        : null
    }).filter(postResolver => postResolver)
    await Promise.all(preparePostResolvers.map(postResolver => postResolver(...args, res)))

    return res
  }
}
