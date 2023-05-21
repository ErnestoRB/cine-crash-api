import express from 'express'
import routes from './routing'
import cors from 'cors'
const app = express()
const port = Number(process.env.PORT ?? 4000)

if (Number.isNaN(app)) {
  console.error('Puerto inválido')

  process.exit(1)
}

app.use(cors({ origin: ['http://localhost:4200', 'cine.ernestorb.com'] }))
app.use(express.static('static'))
app.use(routes)

app.listen(port, () => {
  console.log(`Escuchando en puerto ${port}`)
})
