import { AsyncLocalStorage } from 'node:async_hooks';
import crypto from 'node:crypto';
import { Request, Response, NextFunction } from 'express';

export interface RequestContextStore {
  requestId: string;
  userId?: string;
  roles?: string[];
  traceId?: string;
  spanId?: string;
}

const storage = new AsyncLocalStorage<RequestContextStore>();

export const getRequestContext = () => storage.getStore();

export const requestContextMiddleware = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  const requestIdHeader = req.headers['x-request-id'];
  const requestId = Array.isArray(requestIdHeader)
    ? requestIdHeader[0]
    : requestIdHeader ?? crypto.randomUUID();

  storage.run(
    {
      requestId,
      traceId: req.headers['x-trace-id'] as string | undefined,
      spanId: req.headers['x-span-id'] as string | undefined,
    },
    () => next()
  );
};

export const setRequestContext = (data: Partial<RequestContextStore>) => {
  const store = storage.getStore();
  if (!store) {
    storage.enterWith(data as RequestContextStore);
    return;
  }
  Object.assign(store, data);
};

