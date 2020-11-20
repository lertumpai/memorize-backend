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
              [keyResolver]: prepareAndWrap(quration, keyResolver, permissions[quration][keyResolver], resolvers[quration][keyResolver], postResolvers)
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

export function prepareAndWrap(quration, keyResolver, permission, resolver, postResolvers) {
  return async (...args) => {
    if (permission && typeof permission === 'function') {
      await permission(...args)
    }

    const res = await resolver(...args)

    const preparePostResolvers = Object.values(postResolvers).map(postResolver => {
      return postResolver[quration] && typeof postResolver[quration][keyResolver] === 'function'
        ? postResolver[quration][keyResolver]
        : null
    }).filter(postResolver => postResolver)
    await Promise.all(preparePostResolvers.map(async postResolver => await postResolver(...args)))

    return res
  }
}