import mongoose from 'mongoose'

export async function clearAll() {
  return Promise.all(Object.values(mongoose.models).map(model => model.deleteMany()))
}

export function objectId() {
  return mongoose.Types.ObjectId()
}
