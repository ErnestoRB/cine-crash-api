/* eslint-disable @typescript-eslint/no-misused-promises */
import express from 'express'
import {
  addNotification,
  canSendNotification,
  getAllReservaciones,
  getLatestReservacion,
  getReservacion,
  getReservacionesOnDate,
  getUserDetails,
  getUserReservaciones,
  isAnyReservacionOnDate,
} from '../../firebase/database'
import { Joi, validate } from 'express-validation'
import { transporter } from '../../email'
const router = express.Router()

router.get('/', async (_req, res) => {
  try {
    const reservaciones = await getAllReservaciones()
    res.send(reservaciones)
  } catch (error: any) {
    res.status(500).send({ error: 'Error interno' })
  }
})

router.get('/:id', async (req, res) => {
  try {
    const reservacion = await getReservacion(req.params.id)
    if (reservacion === undefined) {
      return res.status(404).send()
    }
    res.send(reservacion)
  } catch (error: any) {
    res.status(500).send({ error: 'Error interno' })
  }
})

router.get('/user/:userId', async (req, res) => {
  try {
    const reservaciones = await getUserReservaciones(req.params.userId)
    if (reservaciones === undefined) {
      return res.status(404).send()
    }
    res.send(reservaciones)
  } catch (error: any) {
    res.status(500).send({ error: 'Error interno' })
  }
})

router.get('/latest/:userId', async (req, res) => {
  try {
    const reservacion = await getLatestReservacion(req.params.userId)
    if (reservacion === undefined) {
      return res.status(404).send()
    }
    res.send(reservacion)
  } catch (error: any) {
    res.status(500).send({ error: 'Error interno' })
  }
})

router.get(
  '/is_taken/:date',
  validate({
    params: Joi.object({
      date: Joi.date().required(),
    }),
  }),
  async (req, res) => {
    try {
      const dateString = req.params.date
      const date = new Date(dateString)
      const taken = await isAnyReservacionOnDate(date)
      res.status(taken ? 403 : 200).end()
    } catch (error: any) {
      res.status(500).send({ error: 'Error interno' })
    }
  }
)

router.get(
  '/taken/:date',
  validate({
    params: Joi.object({
      date: Joi.date().required(),
    }),
  }),
  async (req, res) => {
    try {
      const dateString = req.params.date
      const reservaciones = await getReservacionesOnDate(dateString)
      res.status(200).send(reservaciones)
    } catch (error: any) {
      res.status(500).send({ error: 'Error interno' })
    }
  }
)

router.get('/notification/:id', async (req, res) => {
  try {
    const { id } = req.params
    const reservacion = await getReservacion(id)
    if (reservacion == null) {
      return res.status(404).send({ error: 'No existe esa reservación' })
    }
    const notificable = await canSendNotification(id)
    if (!notificable) {
      return res
        .status(400)
        .send({ error: 'Ya se enviaron demasiadas notificaciones' })
    }
    const userDetails = await getUserDetails(reservacion.idCliente)
    if (userDetails == null) {
      return res.status(400).send({
        error: 'No se encontraron datos del cliente que hizo la reservación',
      })
    }
    const { email } = userDetails
    if (email == null) {
      return res.status(400).send({
        error: `No se vinculó ningun correo a este usuario (${
          userDetails.name ?? reservacion.idCliente
        })!`,
      })
    }
    const emailToBeSend = {
      from: process.env.EMAIL_ADDRESS,
      to: email,
      subject: '[CineCrash] Confirmación de reservación',
      text: '¡Hola! Acabas de reservar un escape inimaginable al cine',
      html: `<h1>Detalles de orden</h1>
      <h2>CineCrash. Creando recuerdos a través de fotogramas</h2>
      <p>Gracias por reservar, ${
        userDetails.name ?? email
      }. Tu reservación con ID <b>#${
        reservacion.id
      }</b> ha sido satisfactoria:<br>
        Título: "${reservacion.titulo}"
        Fecha: "${reservacion.fechaReservacion as unknown as string}"
        Cantidad de boletos: "${reservacion.boletos}"
        Total: "${reservacion.boletos * 150}"
      </p>`,
    }
    await transporter.sendMail(emailToBeSend)
    await addNotification(reservacion.id)
    return res.send({ msg: 'Notificación enviada' })
  } catch (error: any) {
    console.log(error)

    res.status(500).send({ error: 'Error al enviar la notificación' })
  }
  res.end()
})

export default router
