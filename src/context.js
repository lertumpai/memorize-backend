import glob from 'glob'
import * as authentication from './authentication'

export function context({ req }) {
  // get all models
  const importModels = glob.sync(`${__dirname}/domain/*/model`).map(path => require(path))
  const model = importModels.reduce((result, obj) => ({ ...result, ...obj }), {})

  return {
    ...model,
    ...authentication,
  }
}

module.exports = context