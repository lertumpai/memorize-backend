import glob from 'glob'

export async function context({ req }) {
  console.log()
  // get all models
  const importModels = glob.sync(`${__dirname}/domain/*/model`).map(path => require(path))
  const model = importModels.reduce((result, obj) => ({ ...result, ...obj }) , {})

  return {
    ...model,
  }
}

module.exports = context