import glob from 'glob'

export async function wrapMongoDBModel() {
  const models = glob.sync(`${__dirname}/*/index.js`).reduce((result, path) => ({ ...result, ...require(path) }), {})
  await Promise.all(Object.values(models).map(model => model.clearAll()))
  return models
}
