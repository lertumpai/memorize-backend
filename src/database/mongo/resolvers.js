import { models } from 'mongoose'

async function listIndexes() {
  const indexes = await Promise.all(
    Object
      .entries(models)
      .map(async ([key, model]) => {
        const indexes = await model.listIndexes()
        return indexes.map(index => `${key}: ${index.name}`)
      })
  )
  return indexes.flat()
}

module.exports = {
  Mutation: {
    async syncMongoIndexes() {
      const indexesBeforeSync = await listIndexes()
      const indexesAfterSync = await listIndexes()
      return 'hi'
    },
  },
}