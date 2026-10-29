import express, { Express, Request, Response } from 'express'
import cors from 'cors'
import { loggerMiddleware } from './middlewares/logger.middleware'
import { errorHandler } from './middlewares/error.middleware'
import courseRoutes from './routes/course.routes'
import categoryRoutes from './routes/category.routes'

const app: Express = express()

app.use(cors())
app.use(express.json())
app.use(loggerMiddleware) // Логування

app.get('/api/v1/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'OK',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    nodeVersion: process.version,
    memoryUsage: process.memoryUsage(),
  })
})

app.use('/api/v1/courses', courseRoutes)
app.use('/api/v1/categories', categoryRoutes)

app.use(errorHandler) // Глобальний обробник помилок (в кінці!)

export default app
