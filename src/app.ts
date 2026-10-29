import express from 'express';
import cors from 'cors';
import { loggerMiddleware } from './middlewares/logger.middleware';
import { errorHandler } from './middlewares/error.middleware';
import courseRoutes from './routes/course.routes';
import categoryRoutes from './routes/category.routes';

const app = express();

app.use(cors());
app.use(express.json());
app.use(loggerMiddleware);

app.get('/api/v1/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    nodeVersion: process.version,
    memoryUsage: process.memoryUsage(),
  });
});

app.use('/api/v1/courses', courseRoutes);
app.use('/api/v1/categories', categoryRoutes);

// обробник помилок має бути останнім
app.use(errorHandler);

export default app;
