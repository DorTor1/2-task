export interface ServiceConfig {
    env: string;
    logLevel: string;
    jwtSecret: string;
    jwtExpiresIn: string;
    databaseUrl?: string;
    apiGatewayPort: number;
    userServicePort: number;
    orderServicePort: number;
    userServiceUrl: string;
    orderServiceUrl: string;
    serviceApiKey: string;
    defaultAdminEmail: string;
    defaultAdminPassword: string;
    defaultAdminName: string;
    requestTimeoutMs: number;
}
export declare const getConfig: () => ServiceConfig;
