import { Router } from 'express';
import { googleLogin, me, logout } from '../controllers/authController.js';
import { requireSession } from '../middleware/auth.js';

export const authRoutes = Router();
authRoutes.post('/google', googleLogin);
authRoutes.get('/me', requireSession, me);
authRoutes.post('/logout', logout);
