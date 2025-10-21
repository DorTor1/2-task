import { NextFunction, Request, Response } from 'express';
import { verifyJwt } from '../utils/jwt';
import { UnauthorizedError, ForbiddenError } from '../errors';
import { setRequestContext } from './request-context';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    roles: string[];
    email: string;
  };
}

export const authenticate = () =>
  (req: AuthenticatedRequest, _res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return next(new UnauthorizedError('Authorization header missing'));
    }

    const token = authHeader.substring('Bearer '.length);
    try {
      const payload = verifyJwt(token);
      req.user = {
        id: payload.sub,
        roles: payload.roles ?? [],
        email: payload.email,
      };
      setRequestContext({ userId: payload.sub, roles: payload.roles ?? [] });
      return next();
    } catch {
      return next(new UnauthorizedError('Invalid token'));
    }
  };

export const authorize = (roles: string[]) =>
  (req: AuthenticatedRequest, _res: Response, next: NextFunction) => {
    const userRoles = req.user?.roles ?? [];
    const allowed = roles.some((role) => userRoles.includes(role));
    if (!allowed) {
      return next(new ForbiddenError('Insufficient permissions'));
    }
    return next();
  };

