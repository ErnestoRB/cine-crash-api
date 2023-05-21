import express from 'express'
import routes from './routing'
const app = express()
const port = Number(process.env.PORT ?? 4000)

if (Number.isNaN(app)) {
  console.error('Puerto inválido')

  process.exit(1)
}

app.use(routes)

app.listen(port, () => {
  console.log(`Escuchando en puerto ${port}`)
})
