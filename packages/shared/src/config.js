"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConfig = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const getEnv = (key, fallback) => process.env[key] ?? fallback;
const getNumberEnv = (key, fallback) => {
    const value = getEnv(key);
    if (!value) {
        return fallback;
    }
    const parsed = Number(value);
    if (Number.isNaN(parsed)) {
        throw new Error(`Environment variable ${key} must be a number`);
    }
    return parsed;
};
const getConfig = () => {
    const jwtSecret = getEnv('JWT_SECRET', 'dev-secret');
    if (!jwtSecret) {
        throw new Error('Missing required env variable JWT_SECRET');
    }
    return {
        env: process.env.NODE_ENV ?? 'development',
        logLevel: getEnv('LOG_LEVEL', 'debug') ?? 'debug',
        jwtSecret,
        jwtExpiresIn: getEnv('JWT_EXPIRES_IN', '1h') ?? '1h',
        databaseUrl: getEnv('DATABASE_URL'),
        apiGatewayPort: getNumberEnv('API_GATEWAY_PORT', 3000),
        userServicePort: getNumberEnv('USER_SERVICE_PORT', 3001),
        orderServicePort: getNumberEnv('ORDER_SERVICE_PORT', 3002),
        userServiceUrl: getEnv('USER_SERVICE_URL', 'http://localhost:3001') ?? 'http://localhost:3001',
        orderServiceUrl: getEnv('ORDER_SERVICE_URL', 'http://localhost:3002') ?? 'http://localhost:3002',
        serviceApiKey: getEnv('SERVICE_API_KEY', 'internal-secret') ?? 'internal-secret',
        defaultAdminEmail: getEnv('DEFAULT_ADMIN_EMAIL', 'admin@example.com') ?? 'admin@example.com',
        defaultAdminPassword: getEnv('DEFAULT_ADMIN_PASSWORD', 'Admin1234!') ?? 'Admin1234!',
        defaultAdminName: getEnv('DEFAULT_ADMIN_NAME', 'Project Admin') ?? 'Project Admin',
        requestTimeoutMs: getNumberEnv('REQUEST_TIMEOUT_MS', 5000),
    };
};
exports.getConfig = getConfig;
//# sourceMappingURL=config.js.map