import { validate, Joi } from 'express-validation'
import express from 'express'
import { transporter } from '../../email'
const router = express.Router()

router.post(
  '/',
  validate(
    {
      body: Joi.object({
        email: Joi.string().email().required(),
        message: Joi.string().required(),
      }).required(),
    },
    { keyByField: true },
    {}
  ),
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  async (req, res) => {
    try {
      if (req.body === undefined || req.body === null) {
        res.status(400).send({ message: 'No incluiste cuerpo de la petición' })
        return
      }
      const { email, message } = req.body as { email: string; message: string }
      const emailToBeSend = {
        from: process.env.EMAIL_ADDRESS,
        to: email,
        subject: '[CineCrash] Recepción de comentario',
        text: 'Gracias por contactarnos. Nos ayuda a mejorar y ofrecerte un mejor servicio',
        html: `<h1>Gracias por contactarnos.</h1> <p>Nos ayuda a mejorar y ofrecerte un mejor servicio</p>
        <p>Tu mensaje fue: "${message}"</p>`,
      }
      await transporter.sendMail(emailToBeSend)
      res.send({ message: 'Se envio mensaje a tu correo' })
    } catch (error) {
      console.log(error)
      res.status(500).send({ message: 'Email no pudo ser enviado' })
    }
  }
)

export default router
