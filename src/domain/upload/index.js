import express from 'express'
import multer from 'multer'

import { uploadImage } from './utils/upload'

const router = express.Router()

router.get('/check', (req, res) => {
  res.json({ message: '/upload is available' })
})

const upload = multer()
router.post('/', upload.single('image'), async (req, res) => {
  const { file, body } = req
  const { destination } = body
  const uploaded = await uploadImage(file, { destination })
  res.json(uploaded)
})

module.exports = router
