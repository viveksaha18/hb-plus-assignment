import crypto from 'node:crypto';
import { env } from '../config/env.js';

export function createSessionToken(): string {
  return crypto.randomBytes(32).toString('base64url');
}

export function hashSessionToken(token: string): string {
  return crypto.createHmac('sha256', env.sessionSecret || 'development-only-session-secret').update(token).digest('hex');
}
