import pino from 'pino';
import { Options as PinoHttpOptions } from 'pino-http';
export interface LoggerOptions {
    serviceName: string;
    level?: pino.LevelWithSilent;
}
export declare const createLogger: ({ serviceName, level }: LoggerOptions) => import("pino").Logger<never>;
export declare const createHttpLogger: (options: LoggerOptions, extra?: PinoHttpOptions) => import("pino-http").HttpLogger<import("http").IncomingMessage, import("http").ServerResponse<import("http").IncomingMessage>, never>;
