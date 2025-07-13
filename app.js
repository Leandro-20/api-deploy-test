const express = require('express')
const movies = require('./movies.json')
const crypto = require('node:crypto')
const cors = require('cors')
const { valiDateMovie, validDateParcialMovie } = require('./schemas/movies')
const app = express()

const PORT = process.env.PORT ?? 1234
app.disable('x-powered-by')
app.use(express.json())
app.use(cors({
  origin: (origin, call) => {
    const ACCESS_ORIGINS = [
      'http://localhost:33943'
    ]
    if (ACCESS_ORIGINS.includes(origin)) {
      return call(null, true)
    }
    if (!origin) {
      return call(null, true)
    }
    return call(new Error('Not allowed by CORS'))
  }
}))

app.get('/movies', (req, res) => {
  // const origin = req.header('origin')
  // console.log('origin', !origin)
  // if (ACCESS_ORIGINS.includes(origin) || !origin) { res.header('Access-Control-Allow-Origin', origin) }

  const { genre } = req.query
  if (genre) {
    const filterMovies = movies.filter(movie => movie.genre.some(g => g.toLowerCase() === genre.toLowerCase()))
    return res.json(filterMovies)
  }
  return res.json(movies)
})

app.get('/movies/:id', (req, res) => {
  const { id } = req.params
  const movie = movies.find((movie) => movie.id === id)
  if (movie) return res.json(movie)
  res.status(404).json({ mesaje: 'Movie not found' })
})

app.post('/movies', (req, res) => {
  const result = valiDateMovie(req.body)

  if (result.error) {
    return res.status(400).json({ error: JSON.parse(result.error.message) })
  }
  const newMovie = {
    id: crypto.randomUUID(),
    ...result.data
  }
  movies.push(newMovie)
  res.status(201).json(newMovie)
})

app.patch('/movies/:id', (req, res) => {
  const result = validDateParcialMovie(req.body)

  if (!result.success) {
    return res.status(400).json({ error: JSON.parse(result.error.message) })
  }
  const { id } = req.params

  const movieIndex = movies.findIndex(movie => movie.id === id)

  if (movieIndex === -1) { return res.status(404).json({ error: JSON.parse({ message: 'Movie not found' }) }) }

  const upDateMovie = { ...movies[movieIndex], ...result.data }

  movies[movieIndex] = upDateMovie
  return res.json(upDateMovie)
})

app.delete('/movies/:id', (req, res) => {
  // const origin = req.header('origin')
  // if (ACCESS_ORIGINS.includes(origin) || !origin) {
  //   res.header('Access-Control-Allow-Origin', origin)
  // }
  const { id } = req.params
  const movieIndex = movies.findIndex(movie => movie.id === id)

  if (movieIndex === -1) { return res.status(404).json({ error: JSON.parse({ message: 'Movie not found' }) }) }
  movies.splice(movieIndex, 1)
  return res.json({ message: 'Movie deleted' })
})

// app.options('/movies/:id', (req, res) => {
//   const origin = req.header('origin')
//   if (ACCESS_ORIGINS.includes(origin) || !origin) {
//     res.header('Access-Control-Allow-Origin', origin)
//     res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE')
//   }
//   res.send(200)
// })

app.listen(PORT, () => {
  console.log(`servidor en el http://localhost:${PORT}`)
})
