import express from 'express'
import { Autor } from '../../models/Autor'
const router = express.Router()

router.get('/hola', (req, res) => {
  res.send('Hola')
})

router.get('/autores', (req, res) => {
  const autores: Autor[] = [
    {
      nombre: 'Ernesto Rodrigo',
      apellido: 'Ramirez Briano',
      image: '/avatar/ernestoAvatar.jpg',
      id: 289171,
    },
    {
      nombre: 'Iker',
      apellido: 'Jiménez Tovar',
      image: '/avatar/ikeravatar.jpg',
      id: 291255,
    },
    {
      nombre: 'Karen Itzel',
      apellido: 'Vazquez Reyes',
      image: '/avatar/itzavatar.jpg',
      id: 297822,
    },
    {
      nombre: 'Paulina Lizbeth',
      apellido: 'Esparza Jiménez',
      image: '/avatar/pauavatar.jpg',
      id: 217114,
    },
  ]
  res.send(autores)
})

export default router
