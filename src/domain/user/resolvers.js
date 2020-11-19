module.exports = {
  Query: {
    user(obj, { id }, context) {
      return {
        id: 1,
        name: 'hi'
      }
    },
  },
  User: {
    id({ id }) {
      console.log('resolver id:', id)
      return 'id'
    },
    name({ name }) {
      console.log('resolver name:', name)
      return 'name'
    }
  }
}