import mongoose from 'mongoose'

mongoose
  .connect(
    process.env.MONGO_URI,
    { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false }
  )
  // eslint-disable-next-line no-console
  .then(() => console.log('Connect Mongo Success'))
  // eslint-disable-next-line no-console
  .catch(() => console.log('Connect Mongo Error'))

export default mongoose