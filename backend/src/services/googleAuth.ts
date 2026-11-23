import { OAuth2Client, TokenPayload } from 'google-auth-library';
import { env } from '../config/env.js';
import { AppError } from '../utils/errors.js';

const allowedClients = [
  env.googleWebClientId,
  env.googleAndroidClientId,
  env.googleIosClientId,
].filter(Boolean);

export async function verifyGoogleIdToken(idToken: string): Promise<TokenPayload> {
  if (!idToken) throw new AppError(400, 'Google ID token is required');
  if (!allowedClients.length) throw new AppError(500, 'Google OAuth clients are not configured');

  let payload: TokenPayload | undefined;
  try {
    const ticket = await new OAuth2Client().verifyIdToken({ idToken, audience: allowedClients });
    payload = ticket.getPayload();
  } catch {
    throw new AppError(401, 'Invalid Google ID token');
  }
  if (!payload) throw new AppError(401, 'Invalid Google ID token');
  if (payload.email_verified !== true) throw new AppError(403, 'Your Google email must be verified');

  const email = payload.email?.trim().toLowerCase();
  if (!email || email.split('@').length !== 2 || email.split('@')[1] !== 'hbplus.fit') {
    throw new AppError(403, 'Access restricted. Please login using your official domain email.');
  }
  return payload;
}
