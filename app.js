import express, { json } from 'express'
import { moviesRouter } from './routes/movies.js'
import { corsMiddleware } from './middlewares/cors.js'

const app = express()

const PORT = process.env.PORT ?? 1234

app.disable('x-powered-by')

app.use(json())

app.use(corsMiddleware())

app.use('/movies', moviesRouter)

app.listen(PORT, () => {
  console.log(`servidor en el http://localhost:${PORT}`)
})
