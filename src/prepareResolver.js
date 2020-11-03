export function prepareResolver(resolvers, postResolvers) {
  return Object.keys(resolvers).reduce((result, quration) => {
    return {
      ...result,
      [quration]: Object.keys(resolvers[quration]).reduce((result, keyResolver) => {
        return {
          ...result,
          [keyResolver]: prepareAndWrap(resolvers[quration][keyResolver], postResolvers[quration][keyResolver])
        }
      }, {})
    }
  }, {})
}

export function prepareAndWrap(resolver, postResolver) {
  return async (...args) => {
    const res = await resolver(...args)
    await postResolver(...args)
    return res
  }
}