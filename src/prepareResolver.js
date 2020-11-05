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
              [keyResolver]: prepareAndWrap(permissions[quration][keyResolver], resolvers[quration][keyResolver], postResolvers[quration][keyResolver])
            }
          }, {})
        }

      default:
        return {
          ...result,
          [quration]: resolvers[quration]
        }
    }
  }, {})
}

export function prepareAndWrap(permission, resolver, postResolver) {
  return async (...args) => {
    if (permission && typeof permission === 'function') {
      await permission(...args)
    }

    const res = await resolver(...args)

    if (postResolver && typeof postResolver === 'function') {
      await postResolver(...args)
    }

    return res
  }
}