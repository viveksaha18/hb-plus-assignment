import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { env } from './config/env.js';
import { authRoutes } from './routes/authRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';
import { pool } from './database/pool.js';

const app = express();
app.disable('x-powered-by');
app.use(helmet());
app.use(cors({
  origin(origin, callback) {
    if (!origin || env.corsOrigins.includes(origin)) callback(null, true);
    else callback(new Error('Origin not allowed'));
  },
  credentials: true,
}));
app.use(express.json({ limit: '16kb' }));
app.use(cookieParser());
app.use('/api/auth', rateLimit({ windowMs: 60_000, limit: 20, standardHeaders: true }));
app.use('/api/auth', authRoutes);

app.get('/api/health', async (_req, res, next) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'ok', database: 'connected', timestamp: new Date().toISOString() });
  } catch (error) {
    next(error);
  }
});
app.use(errorHandler);

app.listen(env.port, () => console.log(`HB Plus backend listening on port ${env.port}`));
