import { NextFunction, Request, Response } from 'express';
export interface AuthenticatedRequest extends Request {
    user?: {
        id: string;
        roles: string[];
        email: string;
    };
}
export declare const authenticate: () => (req: AuthenticatedRequest, _res: Response, next: NextFunction) => void;
export declare const authorize: (roles: string[]) => (req: AuthenticatedRequest, _res: Response, next: NextFunction) => void;
