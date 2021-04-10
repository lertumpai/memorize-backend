module.exports = {
  Mutation: {
    async uploadImage(_, { file, path }) {
      console.log(path)
      console.log(await file)
      return 'Finish upload'
    },
  },
}
