import { verifyToken } from './authentication/token'
import User from './database/mongo/user/User'

export async function context({ req }) {
  const user = verifyToken(req.headers.authentication)
  return {
    user,
    User
  }
}

module.exports = context