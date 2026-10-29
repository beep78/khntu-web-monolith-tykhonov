import express, { Express, Request, Response } from 'express'
import cors from 'cors'

const app: Express = express()

app.use(cors())
app.use(express.json())

app.get('/api/v1/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'OK',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    // Nice-to-have: розширена системна інформація
    nodeVersion: process.version,
    memoryUsage: process.memoryUsage(),
  })
})

export default app
