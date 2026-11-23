import type { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors.js';

export function errorHandler(error: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (error instanceof AppError) {
    res.status(error.statusCode).json({ error: error.message });
    return;
  }
  if (error && typeof error === 'object' && 'code' in error && error.code === '23505') {
    res.status(409).json({ error: 'Account already exists' });
    return;
  }
  console.error(error);
  res.status(500).json({ error: 'Internal server error' });
}
