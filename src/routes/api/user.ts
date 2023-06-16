/* eslint-disable @typescript-eslint/no-misused-promises */
import express from 'express'
import { isPhoneRegistered } from '../../firebase/database'
const router = express.Router()

router.get('/phone/:phone', async (req, res) => {
  try {
    const { phone } = req.params
    const taken = await isPhoneRegistered(phone)
    res.status(200).send({
      taken,
    })
  } catch (error: any) {
    res.status(500).send({ error: 'Error interno' })
  }
})

export default router
