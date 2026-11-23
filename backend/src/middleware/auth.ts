import type { Request, Response, NextFunction } from 'express';
import { pool } from '../database/pool.js';
import { hashSessionToken } from '../utils/session.js';
import { AppError } from '../utils/errors.js';

export async function requireSession(req: Request, res: Response, next: NextFunction) {
  try {
    const cookieToken = req.cookies?.hbplus_session as string | undefined;
    const bearerToken = req.headers.authorization?.startsWith('Bearer ')
      ? req.headers.authorization.slice(7)
      : undefined;
    const token = cookieToken ?? bearerToken;
    if (!token) throw new AppError(401, 'Authentication required');

    const result = await pool.query(
      `SELECT u.id, u.google_id, u.name, u.email, u.profile_picture, u.role, u.created_at, u.updated_at
       FROM application_sessions s
       JOIN users u ON u.id = s.user_id
       WHERE s.token_hash = $1 AND s.expires_at > NOW()`,
      [hashSessionToken(token)],
    );
    if (!result.rows.length) throw new AppError(401, 'Session expired or invalid');
    res.locals.user = result.rows[0];
    next();
  } catch (error) {
    next(error);
  }
}
