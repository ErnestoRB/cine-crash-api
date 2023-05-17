import express from 'express'
import api from './routes/api'
const router = express.Router()

router.use('/api', api)

export default router
