import express from 'express'
import api from './routes/api'
import contactRouter from './routes/api/contact'

const router = express.Router()

router.use('/api', api)
router.use('/api/contact', contactRouter)

router.use('/api', (req, res) => {
  res.status(404).send({ message: 'No encontrado!' })
})

export default router
