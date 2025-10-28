import { Request, Response, NextFunction } from 'express';
export interface RequestContextStore {
    requestId: string;
    userId?: string;
    roles?: string[];
    traceId?: string;
    spanId?: string;
}
export declare const getRequestContext: () => RequestContextStore | undefined;
export declare const requestContextMiddleware: (req: Request, _res: Response, next: NextFunction) => void;
export declare const setRequestContext: (data: Partial<RequestContextStore>) => void;
