import { randomUUID } from 'node:crypto';
import pino from 'pino';
import pinoHttp, { Options as PinoHttpOptions } from 'pino-http';
import { getRequestContext } from './middlewares/request-context';

export interface LoggerOptions {
  serviceName: string;
  level?: pino.LevelWithSilent;
}

export const createLogger = ({ serviceName, level = 'info' }: LoggerOptions) =>
  pino({
    name: serviceName,
    level,
    formatters: {
      level(label) {
        return { level: label };
      },
    },
    timestamp: pino.stdTimeFunctions.isoTime,
  });

export const createHttpLogger = (
  options: LoggerOptions,
  extra?: PinoHttpOptions
) => {
  const baseLogger = createLogger(options);
  return pinoHttp({
    logger: baseLogger,
    redact: {
      paths: ['req.headers.authorization', '*.password', '*.token'],
    },
    genReqId: (req) => {
      const headerId = req.headers['x-request-id'];
      return (Array.isArray(headerId) ? headerId[0] : headerId) ?? randomUUID();
    },
    customProps: () => {
      const ctx = getRequestContext();
      return ctx ? { requestId: ctx.requestId, userId: ctx.userId } : {};
    },
    customLogLevel: (res, err) => {
      if (err || res.statusCode >= 500) return 'error';
      if (res.statusCode >= 400) return 'warn';
      return 'info';
    },
    ...extra,
  });
};

