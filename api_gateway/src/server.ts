import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import proxy from 'express-http-proxy';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { createHttpLogger, getConfig, requestContextMiddleware, traceMiddleware, authenticate, createRateLimiter, errorHandler } from '@task-platform/shared';

const config = getConfig();
const app = express();

const logger = createHttpLogger({ serviceName: 'api-gateway', level: config.logLevel as never });

app.use(requestContextMiddleware);
app.use(traceMiddleware);
app.use(logger);
app.use(helmet());
app.use(cors({
  origin: '*',
  exposedHeaders: ['x-request-id', 'x-trace-id'],
}));
app.use(express.json());
app.use(createRateLimiter());

app.get('/health', (_req, res) => {
  res.json({ success: true, data: { status: 'ok' } });
});

const proxyOptions = (target: string) => ({
  target,
  changeOrigin: true,
  pathRewrite: { '^/v1/users': '', '^/v1/orders': '' },
  onProxyReq: (proxyReq: any, req: any) => {
    if (req.headers['x-request-id']) {
      proxyReq.setHeader('x-request-id', req.headers['x-request-id']);
    }
    if (req.headers['x-trace-id']) {
      proxyReq.setHeader('x-trace-id', req.headers['x-trace-id']);
    }
    if (req.headers['x-span-id']) {
      proxyReq.setHeader('x-parent-span-id', req.headers['x-span-id']);
    }
  },
  onProxyRes: (proxyRes: any, req: any, res: any) => {
    const traceId = proxyRes.headers['x-trace-id'] ?? req.headers['x-trace-id'];
    if (traceId) {
      res.setHeader('x-trace-id', traceId);
    }
  },
});

app.use(
  '/v1/users',
  express.Router()
    .post('/register', proxy(config.userServiceUrl, { proxyReqPathResolver: (req) => `${config.userServiceUrl}${req.url}` }))
    .post('/login', proxy(config.userServiceUrl, { proxyReqPathResolver: (req) => `${config.userServiceUrl}${req.url}` }))
    .use(authenticate())
    .use(createProxyMiddleware(proxyOptions(config.userServiceUrl)))
);

app.use(
  '/v1/orders',
  authenticate(),
  createProxyMiddleware(proxyOptions(config.orderServiceUrl))
);

app.use(errorHandler);

const port = config.apiGatewayPort;

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`API Gateway running on port ${port}`);
});

export default app;

