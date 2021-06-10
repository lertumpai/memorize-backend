import jwt from 'jsonwebtoken'

import { getImageUrl } from '../domain/upload/utils/upload'
import {
  UploadProfile,
} from '../database/mongo'

const key = process.env.PRIVATE_KEY

// payload = { userId, username, profile }
export async function token(user) {
  if (!user) {
    return null
  }

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
