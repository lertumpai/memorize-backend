import { Storage } from '@google-cloud/storage'

function generateString(n) {
  let result = ''
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  const charactersLength = characters.length
  for (let i = 0; i < n; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  return result
}

function uploadFile() {
  const storage = new Storage({ keyFilename: 'key.json' })
  const bucket = storage.bucket(process.env.BUCKET_NAME)
}
