import jwt from 'jsonwebtoken';
import { getConfig } from '../config';

interface JwtPayload {
  sub: string;
  roles?: string[];
  email: string;
}

export const signJwt = (payload: JwtPayload) => {
  const config = getConfig();
  return jwt.sign(payload, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn,
    issuer: 'task-platform',
  });
};

export const verifyJwt = (token: string): JwtPayload => {
  const config = getConfig();
  return jwt.verify(token, config.jwtSecret) as JwtPayload;
};

