import dotenv from 'dotenv';

dotenv.config();

const getEnv = (key: string, fallback?: string) => process.env[key] ?? fallback;

const getNumberEnv = (key: string, fallback: number) => {
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

export const getConfig = () => {
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
    userServiceUrl: getEnv('USER_SERVICE_URL', 'http://service_users:3001') ?? 'http://service_users:3001',
    orderServiceUrl: getEnv('ORDER_SERVICE_URL', 'http://service_orders:3002') ?? 'http://service_orders:3002',
    serviceApiKey: getEnv('SERVICE_API_KEY', 'internal-secret') ?? 'internal-secret',
  };
};

