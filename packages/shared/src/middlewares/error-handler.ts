import { NextFunction, Request, Response } from 'express';
import { AppError } from '../errors';
import { getRequestContext } from './request-context';

export const errorHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  const ctx = getRequestContext();
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      error: {
        code: err.code,
        message: err.message,
        requestId: ctx?.requestId,
      },
    });
    return;
  }

  res.status(500).json({
    success: false,
    error: {
      code: 'internal_error',
      message: 'Internal server error',
      requestId: ctx?.requestId,
    },
  });
};

