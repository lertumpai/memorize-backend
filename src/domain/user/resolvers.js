import * as Authentication from '../../authentication'
import { token } from '../../authentication/token'

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

      const uploadedImage = image ? await UploadProfile.create({ author: user.id, image, date }) : null

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
    token(user) {
      return token(user)
    },
  },
  ProfileUser: {
    async image({ image }, args, { UploadProfile }) {
      const imageProfile = await UploadProfile.findById(image)
      return imageProfile ? imageProfile.image : null
    },
  },
}
