import mongoose from 'mongoose'

const schemaUser = new mongoose.Schema({
  username: { type: String, unique: true },
  password: String,
  active: Boolean,
  profile: {
    type: {
      name: String,
      birthday: Date,
      status: String
    },
    default: null
  }
})

export default mongoose.model('User', schemaUser)