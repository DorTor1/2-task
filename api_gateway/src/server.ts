import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { createProxyMiddleware, type Options as ProxyOptions } from 'http-proxy-middleware';
import {
  createHttpLogger,
  getConfig,
  requestContextMiddleware,
  traceMiddleware,
  authenticate,
  createRateLimiter,
  errorHandler,
} from '@task-platform/shared';

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

type Headers = Record<string, string | string[] | undefined>;

const createProxy = (target: string) =>
  createProxyMiddleware({
    target,
    changeOrigin: true,
    pathRewrite: {
      '^/v1/users': '',
      '^/v1/orders': '',
    },
    on: {
      proxyReq: (proxyReq, req) => {
        const headersToForward = ['x-request-id', 'x-trace-id', 'x-span-id', 'authorization'] as const;
        headersToForward.forEach((header) => {
          const value = req.headers[header];
          if (Array.isArray(value)) {
            proxyReq.setHeader(header, value[0]);
          } else if (value) {
            proxyReq.setHeader(header, value);
          }
        });
      },
    },
  } satisfies ProxyOptions);

const usersRouter = express.Router();

usersRouter.post('/register', createProxy(config.userServiceUrl));
usersRouter.post('/login', createProxy(config.userServiceUrl));
usersRouter.use(authenticate());
usersRouter.use(createProxy(config.userServiceUrl));

app.use('/v1/users', usersRouter);
app.use('/v1/orders', authenticate(), createProxy(config.orderServiceUrl));

app.use(errorHandler);

const port = config.apiGatewayPort;

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`API Gateway running on port ${port}`);
});

export default app;

