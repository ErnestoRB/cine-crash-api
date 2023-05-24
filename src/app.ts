import express from 'express'
import routes from './routing'
import cors from 'cors'
import path from 'path'
const app = express()
const port = Number(process.env.PORT ?? 4000)

if (Number.isNaN(app)) {
  console.error('Puerto inválido')

  process.exit(1)
}

app.use(cors({ origin: ['http://localhost:4200', 'cine.ernestorb.com'] }))
app.use(express.static(path.join(__dirname, 'static')))
app.use(routes)

app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'static', 'index.html'))
})

app.listen(port, () => {
  console.log(`Escuchando en puerto ${port}`)
})
