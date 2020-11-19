import glob from 'glob'
import { register, login } from './authentication'

export async function context({ req }) {
  // get all models
  const importModels = glob.sync(`${__dirname}/domain/*/model`).map(path => require(path))
  const model = importModels.reduce((result, obj) => ({ ...result, ...obj }), {})

  return {
    ...model,
    register,
    login,
  }
}

module.exports = context