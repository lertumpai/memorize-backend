const permission = {
  Query: {
    user(obj, {id}) {
      console.log('permission', id)
    },
  }
}

module.exports = permission
