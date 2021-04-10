import * as Authentication from '../../authentication'
import { token } from '../../authentication/token'
import { getImageUrl } from '../upload/utils/upload'

module.exports = {
  Query: {
    user(_, { id, username }, { User }) {
      return id ? User.findById(id) : User.findByUsername(username)
    },
    login(_, { username, password }, { User }) {
      return Authentication.login({ username, password }, { User })
    },
  },
  Mutation: {
    user(_, { username, password }, { User, date }) {
      return Authentication.register({ username, password }, { User, date })
    },
    async profile(_, { id, input }, { User, UploadProfile, date, user }) {
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
    token(user, args, { UploadProfile, user: currentUser }) {
      return !currentUser || currentUser.id.toString() === user.id.toString() ? token(user, { UploadProfile }) : null
    },
  },
  ProfileUser: {
    async image({ image }, args, { UploadProfile }) {
      const profileImage = await UploadProfile.findById(image)
      const { fileName, destination } = profileImage
      return getImageUrl(fileName, destination)
    },
  },
}
