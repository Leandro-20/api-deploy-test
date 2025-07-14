import cors from 'cors'

const ACCESS_ORIGINS = [
  'http://localhost:8080',
  'http://localhost:33943'
]
export const corsMiddleware = ({ acceptedOrigins = ACCESS_ORIGINS } = {}) => cors({
  origin: (origin, call) => {
    if (acceptedOrigins.includes(origin)) {
      return call(null, true)
    }
    if (!origin) {
      return call(null, true)
    }
    return call(new Error('Not allowed by CORS'))
  }
})
