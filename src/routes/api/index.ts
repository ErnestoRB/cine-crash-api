import express from 'express'
const router = express.Router()

router.get('/hola', (req, res) => {
  res.send('Hola')
})

export default router
