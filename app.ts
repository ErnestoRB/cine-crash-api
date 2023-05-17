import express from 'express'
import routes from './routing'
const app = express()
const port = Number(process.env.PORT ?? 4000)
const hostname = process.env.HOSTNAME ?? '127.0.0.1'

if (Number.isNaN(app)) {
    console.error('Puerto inválido')

    process.exit(1)
}

app.use(routes)

app.listen(port, hostname, () => {
    console.log(`Escuchando en puerto ${port}`)
})
