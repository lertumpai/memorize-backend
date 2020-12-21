import jwt from 'jsonwebtoken'

const key = process.env.PRIVATE_KEY

// payload = { userId, username, profile }
export function token(user) {
  const payload = { id: user.id, username: user.username, profile: user.profile }
  return user ? jwt.sign(payload, key, { expiresIn: '1h' }) : null
  // return user ? jwt.sign(payload, key) : null
}

export function verifyToken(token) {
  if (!token) {
    return null
  }

  try {
    return jwt.verify(token.replace('Memorize ', ''), key)
  } catch(e) {
    return null
  }
}
