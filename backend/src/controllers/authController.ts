import type { Request, Response, NextFunction } from 'express';
import { pool } from '../database/pool.js';
import { verifyGoogleIdToken } from '../services/googleAuth.js';
import { createSessionToken, hashSessionToken } from '../utils/session.js';
import { env } from '../config/env.js';
import { AppError } from '../utils/errors.js';

export async function googleLogin(req: Request, res: Response, next: NextFunction) {
  try {
    const idToken = typeof req.body?.idToken === 'string' ? req.body.idToken : '';
    const payload = await verifyGoogleIdToken(idToken);
    const googleId = payload.sub!;
    const email = payload.email!.trim().toLowerCase();
    const name = payload.name?.trim() || email.split('@')[0];
    const picture = payload.picture ?? null;

    const result = await pool.query(
      `INSERT INTO users (google_id, name, email, profile_picture)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (google_id) DO UPDATE SET
         name = EXCLUDED.name,
         email = EXCLUDED.email,
         profile_picture = EXCLUDED.profile_picture,
         updated_at = NOW()
       RETURNING id, google_id, name, email, profile_picture, role, created_at, updated_at`,
      [googleId, name, email, picture],
    );
    const user = result.rows[0];
    const rawToken = createSessionToken();
    const expiresAt = new Date(Date.now() + env.sessionTtlHours * 60 * 60 * 1000);
    await pool.query(
      'INSERT INTO application_sessions (user_id, token_hash, expires_at) VALUES ($1, $2, $3)',
      [user.id, hashSessionToken(rawToken), expiresAt],
    );

    res.cookie('hbplus_session', rawToken, {
      httpOnly: true,
      secure: env.nodeEnv === 'production',
      sameSite: env.nodeEnv === 'production' ? 'none' : 'lax',
      expires: expiresAt,
      path: '/',
    });
    res.status(200).json({ user, expiresAt, sessionToken: rawToken });
  } catch (error) {
    next(error);
  }
}

export async function me(req: Request, res: Response) {
  res.json({ user: res.locals.user });
}

export async function logout(req: Request, res: Response) {
  const token = req.cookies?.hbplus_session as string | undefined
    ?? (req.headers.authorization?.startsWith('Bearer ') ? req.headers.authorization.slice(7) : undefined);
  if (token) {
    await pool.query('DELETE FROM application_sessions WHERE token_hash = $1', [hashSessionToken(token)]);
  }
  res.clearCookie('hbplus_session', { path: '/' });
  res.status(204).send();
}
