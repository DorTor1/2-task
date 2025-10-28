import jwt, { type SignOptions } from 'jsonwebtoken';
import { getConfig } from '../config';

interface JwtPayload {
  sub: string;
  roles?: string[];
  email: string;
}

export const signJwt = (payload: JwtPayload) => {
  const config = getConfig();
  const options: SignOptions = {
    expiresIn: config.jwtExpiresIn as SignOptions['expiresIn'],
    issuer: 'task-platform',
  };
  return jwt.sign(payload, config.jwtSecret, options);
};

export const verifyJwt = (token: string): JwtPayload => {
  const config = getConfig();
  return jwt.verify(token, config.jwtSecret) as JwtPayload;
};

