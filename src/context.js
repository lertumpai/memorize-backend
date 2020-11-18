import glob from 'glob'

// get all models
const importModels = glob.sync(`${__dirname}/domain/*/model`).map(path => require(path))
const model = importModels.reduce((result, obj) => ({ ...result, ...obj }) , {})


const context = {
  ...model,
}

module.exports = context