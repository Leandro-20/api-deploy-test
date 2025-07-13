const z = require('zod')

const moviesShema = z.object({
  title: z.string({
    invalid_type_error: 'movie title be string',
    required_error: 'Movie title is require'
  }),
  year: z.number().int().positive().min(1900).max(2025),
  director: z.string(),
  duration: z.number().int().positive(),
  poster: z.url({
    message: 'Poster must be a valid URL'
  }),
  genre: z.array(
    z.enum(['Biography', 'Romance', 'Adventure', 'Action', 'Animation', 'Crime', 'Sci-Fi', 'Drama', 'Fantasy']),
    {
      invalid_type_error: 'Movie genre must be an array of enum Genre',
      required_error: 'Movie genre is require'
    }
  ),
  rate: z.number().max(10).default(5)
})

const valiDateMovie = (object) => {
  return moviesShema.safeParse(object)
}

const validDateParcialMovie = (object) => {
  return moviesShema.partial().safeParse(object)
}

module.exports = {
  valiDateMovie,
  validDateParcialMovie
}
