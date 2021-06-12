import * as Authentication from '../../authentication'
import { token } from '../../authentication/token'
import { getImageUrl } from '../upload/utils/upload'

import {
  User,
  UploadProfile,
} from '../../database/mongo'

module.exports = {
  Query: {
    user(_, { id, username }) {
      return id ? User.findById(id) : User.findByUsername(username)
    },
    login(_, { username, password }) {
      return Authentication.login({ username, password })
    },
  },
  Mutation: {
    user(_, { username, password }, { date }) {
      return Authentication.register({ username, password }, { date })
    },
    async profile(_, { id, input }, { date, user }) {
      const { name, status, birthday, image } = input

      let uploadedImage
      if (image) {
        uploadedImage = await UploadProfile.create({
          ...image,
          author: user.id,
          date,
        })
      }

      return User.updateProfile(id, {
        name: name,
        status: status,
        birthday: birthday,
        image: uploadedImage,
        date,
      })
    },
  },
  User: {
    token(user, args, { user: currentUser }) {
      return !currentUser || currentUser.id.toString() === user.id.toString() ? token(user) : null
    },
  },
  ProfileUser: {
    async image({ image }) {
      if (!image) {
        return null
      }
      const profileImage = await UploadProfile.findById(image)

      if (!profileImage) {
        return null
      }

      const { fileName, destination } = profileImage
      return getImageUrl(fileName, destination)
    },
  },
}
