import crypto from 'node:crypto';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import {
  authenticate,
  buildPaginationResult,
  createHttpLogger,
  createRateLimiter,
  errorHandler,
  getConfig,
  getPaginationParams,
  NotFoundError,
  BadRequestError,
  ForbiddenError,
  requestContextMiddleware,
  traceMiddleware,
  orderCreateSchema,
  orderUpdateStatusSchema,
  orderQuerySchema,
  createOrderCreatedEvent,
  createOrderStatusUpdatedEvent,
  InMemoryEventPublisher,
  AuthenticatedRequest,
} from '@task-platform/shared';

type OrderStatus = 'created' | 'in_progress' | 'completed' | 'cancelled';

interface OrderItem {
  productId: string;
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
}

const config = getConfig();
const app = express();
const logger = createHttpLogger({ serviceName: 'service-orders', level: config.logLevel as never });

const orders = new Map<string, Order>();

const eventPublisher = new InMemoryEventPublisher();

const calculateTotal = (items: OrderItem[]) =>
  items.reduce((total, item) => total + item.price * item.quantity, 0);

const assertOrderOwnership = (order: Order, userId: string) => {
  if (order.userId !== userId) {
    throw new ForbiddenError('You cannot access this order');
  }
};

app.use(requestContextMiddleware);
app.use(traceMiddleware);
app.use(logger);
app.use(helmet());
app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(createRateLimiter());

app.get('/health', (_req, res) => {
  res.json({ success: true, data: { status: 'ok' } });
});

app.use(authenticate());

app.post('/', async (req: AuthenticatedRequest, res, next) => {
  try {
    const data = orderCreateSchema.parse(req.body);

    if (!req.user?.id) {
      throw new BadRequestError('Missing user context');
    }

    const now = new Date().toISOString();
    const id = crypto.randomUUID();
    const items = data.items.map((item) => ({ ...item }));
    const totalAmount = calculateTotal(items);

    const order: Order = {
      id,
      userId: req.user.id,
      items,
      totalAmount,
      status: 'created',
      createdAt: now,
      updatedAt: now,
    };

    orders.set(id, order);

    await eventPublisher.publish(
      createOrderCreatedEvent({ orderId: id, userId: req.user.id, totalAmount })
    );

    res.status(201).json({
      success: true,
      data: order,
    });
  } catch (error) {
    next(error);
  }
});

app.get('/:id', (req: AuthenticatedRequest, res, next) => {
  try {
    const order = orders.get(req.params.id);
    if (!order) {
      throw new NotFoundError('Order not found');
    }

    assertOrderOwnership(order, req.user!.id);

    res.json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
});

app.get('/', (req: AuthenticatedRequest, res, next) => {
  try {
    const query = orderQuerySchema.parse(req.query);
    const { page, pageSize, limit, offset } = getPaginationParams(query);

    let userOrders = Array.from(orders.values()).filter(
      (order) => order.userId === req.user!.id
    );

    if (query.status) {
      userOrders = userOrders.filter((order) => order.status === query.status);
    }

    if (query.sort) {
      const direction = query.direction === 'desc' ? -1 : 1;
      userOrders.sort((a, b) => {
        if (query.sort === 'createdAt') {
          return direction * (a.createdAt.localeCompare(b.createdAt));
        }
        return direction * (a.status.localeCompare(b.status));
      });
    }

    const total = userOrders.length;
    const items = userOrders.slice(offset, offset + limit);

    res.json({
      success: true,
      data: buildPaginationResult(items, total, page, pageSize),
    });
  } catch (error) {
    next(error);
  }
});

app.patch('/:id/status', async (req: AuthenticatedRequest, res, next) => {
  try {
    const data = orderUpdateStatusSchema.parse(req.body);
    const order = orders.get(req.params.id);
    if (!order) {
      throw new NotFoundError('Order not found');
    }

    if (!req.user?.roles.includes('manager') && order.userId !== req.user?.id) {
      throw new ForbiddenError('Insufficient permissions to update order status');
    }

    const now = new Date().toISOString();
    const updatedOrder = {
      ...order,
      status: data.status,
      updatedAt: now,
    };

    orders.set(order.id, updatedOrder);

    await eventPublisher.publish(
      createOrderStatusUpdatedEvent({
        orderId: updatedOrder.id,
        userId: updatedOrder.userId,
        status: updatedOrder.status,
      })
    );

    res.json({ success: true, data: updatedOrder });
  } catch (error) {
    next(error);
  }
});

app.delete('/:id', (req: AuthenticatedRequest, res, next) => {
  try {
    const order = orders.get(req.params.id);
    if (!order) {
      throw new NotFoundError('Order not found');
    }

    assertOrderOwnership(order, req.user!.id);

    if (order.status === 'completed') {
      throw new BadRequestError('Cannot cancel completed order');
    }

    const updatedOrder = {
      ...order,
      status: 'cancelled' as OrderStatus,
      updatedAt: new Date().toISOString(),
    };

    orders.set(order.id, updatedOrder);

    res.json({ success: true, data: updatedOrder });
  } catch (error) {
    next(error);
  }
});

app.use(errorHandler);

const port = config.orderServicePort;

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Order service running on port ${port}`);
});

export default app;

