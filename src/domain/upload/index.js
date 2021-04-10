import express from 'express'
import multer from 'multer'

import { uploadImage } from './utils/upload'

const router = express.Router()

router.get('/check', (req, res) => {
  res.json({ message: '/upload is available' })
})

const upload = multer().single('image')
router.post('/', async (req, res) => {
  upload(req, res, async err => {
    if (err) {
      throw err
    }

    const { file, body } = req
    const { destination } = body
    const uploaded = await uploadImage(file, { destination })
    res.json(uploaded)
  })
})

module.exports = router
