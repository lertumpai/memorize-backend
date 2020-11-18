import mongoose from 'mongoose'

mongoose
    .connect(
        process.env.MONGO_URI,
        { useNewUrlParser: true , useUnifiedTopology: true, useFindAndModify: true}
    )
    .then(() => console.log('Connect Mongo Success'))
    .catch(() => console.log('Connect Mongo Error'))

export default mongoose