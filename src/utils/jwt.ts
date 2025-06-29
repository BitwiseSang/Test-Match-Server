import jwt from 'jsonwebtoken';
import { env } from '../config/env';

export function generateToken(payload: object) {
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string) {
  return jwt.verify(token, env.JWT_SECRET);
}
