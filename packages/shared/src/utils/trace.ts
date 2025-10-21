import { randomUUID } from 'node:crypto';
import { Request, Response, NextFunction } from 'express';
import { setRequestContext } from '../middlewares/request-context';

export const traceMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const traceId = (req.headers['x-trace-id'] as string) ?? randomUUID();
  const spanId = randomUUID();
  setRequestContext({ traceId, spanId });
  res.setHeader('x-trace-id', traceId);
  res.setHeader('x-span-id', spanId);
  next();
};

