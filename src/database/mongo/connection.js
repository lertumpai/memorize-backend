/* eslint no-console: "off" */

import mongoose from 'mongoose'

export async function ConnectMongo() {
  try {
    await mongoose
      .connect(
        process.env.MONGO_URI,
        {
          useNewUrlParser: true,
          useUnifiedTopology: true,
          useFindAndModify: false,
          useCreateIndex: true,
        }
      )
    console.log('Connect Mongo Success')
  } catch(e) {
    console.log('Connect Mongo Error', e)
  }
}
