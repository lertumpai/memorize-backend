const postResolvers = {
  Query: {
    user(obj, { id }) {
      console.log('postResolver', id)
    },
  }
}

module.exports = postResolvers
