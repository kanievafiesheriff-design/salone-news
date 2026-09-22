import express from 'express'
import cors from 'cors'
import articleRoutes from './routes/articleRoutes.js'
import settingsRoutes from './routes/settingsRoutes.js'
import { errorMiddleware } from './middleware/errorMiddleware.js'

const app = express()
app.use(cors())
app.use(express.json())
app.get('/api/health', (_request, response) => response.json({ status: 'ok' }))
app.use('/api/articles', articleRoutes)
app.use('/api/settings', settingsRoutes)
app.use(errorMiddleware)

export default app
