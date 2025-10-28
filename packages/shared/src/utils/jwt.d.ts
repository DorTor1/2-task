interface JwtPayload {
    sub: string;
    roles?: string[];
    email: string;
}
export declare const signJwt: (payload: JwtPayload) => string;
export declare const verifyJwt: (token: string) => JwtPayload;
export {};
