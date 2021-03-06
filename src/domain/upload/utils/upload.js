import { Storage } from '@google-cloud/storage'
import sharp from 'sharp'
import { Readable } from 'stream'

function generateString(n) {
  let result = ''
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  const charactersLength = characters.length
  for (let i = 0; i < n; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  return result
}

function getBucket() {
  const storage = new Storage()
  return storage.bucket(process.env.BUCKET_NAME)
}

export async function getImageUrl(fileName, destination) {
  const bucket = getBucket()
  const targetFile = bucket.file(`${destination}/${fileName}`)
  const isTargetFilePublic = await targetFile.isPublic()
  if (!isTargetFilePublic) {
    await targetFile.makePublic()
  }
  return targetFile.publicUrl()
}

export async function uploadImage(file, { destination }) {
  const { mimetype, buffer } = file
  const ext = mimetype.split('/')[1]

  const fileStream = Readable.from(buffer)

  const bucket = getBucket()
  const targetFileName = generateString(20)
  const timestamp = new Date().valueOf()
  const targetFileNameWithTimestamp = `${targetFileName}-${timestamp}.${ext}`
  const targetFile = bucket.file(`${destination}/${targetFileNameWithTimestamp}`)

  const rotateResizer = sharp().rotate().resize(1000)

  return new Promise(resolve => {
    fileStream
      .pipe(rotateResizer)
      .pipe(targetFile.createWriteStream({ resumable: false }))
      .on('error', err => {
        throw err
      })
      .on('finish', async () => {
        const imageUrl = await getImageUrl(targetFileNameWithTimestamp, destination)
        const result = {
          destination,
          fileName: targetFileNameWithTimestamp,
          imageUrl: imageUrl,
        }
        resolve(result)
      })
  })
}

