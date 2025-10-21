import dotenv from 'dotenv';

dotenv.config();

const requiredEnv = (key: string, fallback?: string) => {
  const value = process.env[key] ?? fallback;
  if (!value) {
    throw new Error(`Missing required env variable ${key}`);
  }
  return value;
};

export const getConfig = () => ({
  env: process.env.NODE_ENV ?? 'development',
  logLevel: process.env.LOG_LEVEL ?? 'debug',
  jwtSecret: requiredEnv('JWT_SECRET', 'dev-secret'),
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? '1h',
  databaseUrl: process.env.DATABASE_URL,
  apiGatewayPort: Number(process.env.API_GATEWAY_PORT ?? 3000),
  userServiceUrl: requiredEnv('USER_SERVICE_URL', 'http://service_users:3001'),
  orderServiceUrl: requiredEnv('ORDER_SERVICE_URL', 'http://service_orders:3002'),
});

