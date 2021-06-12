import jwt from 'jsonwebtoken'

const key = process.env.PRIVATE_KEY

// payload = { userId, username, profile }
export async function token(user) {
  if (!user) {
    return null
  }

  const { id, username, profile } = user

  const payload = {
    id,
    username,
    profile: {
      name: profile.name,
      birthday: profile.birthday,
      status: profile.status,
    },
  }
  return jwt.sign(payload, key, { expiresIn: '1h' })
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
