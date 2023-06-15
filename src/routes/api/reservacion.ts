/* eslint-disable @typescript-eslint/no-misused-promises */
import express from 'express'
import {
  getAllReservaciones,
  getLatestReservacion,
  getReservacion,
  getUserReservaciones,
} from '../../firebase/database'
const router = express.Router()

router.get('/', async (_req, res) => {
  const reservaciones = await getAllReservaciones()
  res.send(reservaciones)
})

router.get('/:id', async (req, res) => {
  const reservacion = await getReservacion(req.params.id)
  if (reservacion === undefined) {
    return res.status(404).send()
  }
  res.send(reservacion)
})

router.get('/user/:userId', async (req, res) => {
  const reservaciones = await getUserReservaciones(req.params.userId)
  if (reservaciones === undefined) {
    return res.status(404).send()
  }
  res.send(reservaciones)
})

router.get('/latest/:userId', async (req, res) => {
  const reservacion = await getLatestReservacion(req.params.userId)
  if (reservacion === undefined) {
    return res.status(404).send()
  }
  res.send(reservacion)
})

export default router
