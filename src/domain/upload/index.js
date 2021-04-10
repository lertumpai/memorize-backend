import express from 'express'
import multer from 'multer'

import { uploadImage } from './utils/upload'

const router = express.Router()

router.get('/check', (req, res) => {
  res.json({ message: '/upload is available' })
})

router.post('/', (req, res) => {
  res.json('Hi')
})

const upload = multer()
router.post('/image', upload.single('image'), async (req, res) => {
  const { file, body } = req
  const { destination } = body
  const uploaded = await uploadImage(file, { destination })
  res.json(uploaded)
})

module.exports = router
