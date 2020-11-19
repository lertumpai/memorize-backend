import jwt from 'jsonwebtoken'

const key = process.env.PRIVATE_KEY

// payload = { userId, username, profile }
export function token(payload) {
  return jwt.sign(payload, key)
}

export function verifyToken(token) {
  return token ? jwt.verify(token.replace('Memorize ', ''), key) : null
}
