import * as Authentication from '../../authentication'
import { token } from '../../authentication/token'
import { acknowledge } from '../upload/utils/acknowledge'

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
        const res = await acknowledge(image)
        const acknowledged = await res.json()
        uploadedImage = await UploadProfile.create({
          ...acknowledged,
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
    token(user, args, { UploadProfile }) {
      return token(user, { UploadProfile })
    },
  },
  ProfileUser: {
    async image({ image }, args, { UploadProfile }) {
      const imageProfile = await UploadProfile.findById(image)
      return imageProfile ? imageProfile.urlImage : null
    },
  },
}
