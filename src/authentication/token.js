import jwt from 'jsonwebtoken'

const key = process.env.PRIVATE_KEY

// payload = { userId, username, profile }
export function token(user) {
  const payload = { userId: user.id, username: user.username, profile: user.profile }
  return user ? jwt.sign(payload, key) : null
}

export function verifyToken(token) {
  return token ? jwt.verify(token.replace('Memorize ', ''), key) : null
}
