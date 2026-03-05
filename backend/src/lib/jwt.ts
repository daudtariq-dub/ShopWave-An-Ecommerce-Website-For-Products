import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { AppError } from '../middleware/error';
import type { AuthUser } from '../types';

export type JwtPayload = AuthUser;

export const signToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'],
  });
};

export const verifyToken = (token: string): JwtPayload => {
  try {
    return jwt.verify(token, env.JWT_SECRET) as JwtPayload;
  } catch {
    throw new AppError('Invalid or expired token', 401);
  }
};
