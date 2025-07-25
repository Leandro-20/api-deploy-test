import { MovieModels } from '../models/movie.js'
import { valiDateMovie, validDateParcialMovie } from '../schemas/movies.js'

export class MovieController {
  static async getAll (req, res) {
    const { genre } = req.query
    const movies = await MovieModels.getAll({ genre })
    return res.json(movies)
  }

  static async getById (req, res) {
    const { id } = req.params
    const movie = await MovieModels.getById({ id })
    if (movie) return res.json(movie)
    res.status(404).json({ mesaje: 'Movie not found' })
  }

  static async create (req, res) {
    const result = valiDateMovie(req.body)

    if (result.error) {
      return res.status(400).json({ error: JSON.parse(result.error.message) })
    }
    const newMovie = await MovieModels.create({ input: result.data })
    res.status(201).json(newMovie)
  }

  static async delete (req, res) {
    const { id } = req.params
    const result = await MovieModels.delete({ id })

    if (result === false) { return res.status(404).json({ error: JSON.parse({ message: 'Movie not found' }) }) }
    return res.json({ message: 'Movie deleted' })
  }

  static async update (req, res) {
    const result = validDateParcialMovie(req.body)

    if (!result.success) {
      return res.status(400).json({ error: JSON.parse(result.error.message) })
    }
    const { id } = req.params

    const updateMovie = await MovieModels.update({ id, input: result.data })

    return res.json(updateMovie)
  }
}
