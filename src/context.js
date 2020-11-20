import { verifyToken } from './authentication/token';

export function context({ req }) {
  const user = verifyToken(req.headers.authentication)
  return {
    user,
  }
}

module.exports = context