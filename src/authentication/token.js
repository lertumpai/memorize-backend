import jwt from 'jsonwebtoken'

import { getImageUrl } from '../domain/upload/utils/upload'

const key = process.env.PRIVATE_KEY

// payload = { userId, username, profile }
export async function token(user, { UploadProfile }) {
  const { id, username, profile } = user

  let urlImage
  if (profile.image) {
    const image = await UploadProfile.findById(profile.image)
    const { fileName, destination } = image
    urlImage = await getImageUrl(fileName, destination)
  }

  const payload = {
    id,
    username,
    profile: {
      name: profile.name,
      birthday: profile.birthday,
      status: profile.status,
      image: urlImage,
    },
  }
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
