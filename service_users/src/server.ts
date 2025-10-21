import crypto from 'node:crypto';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import {
  createHttpLogger,
  getConfig,
  requestContextMiddleware,
  traceMiddleware,
  createRateLimiter,
  errorHandler,
  signJwt,
  BadRequestError,
  ConflictError,
  NotFoundError,
  authenticate,
  authorize,
  userRegistrationSchema,
  userLoginSchema,
  userProfileUpdateSchema,
  userQuerySchema,
  getPaginationParams,
  buildPaginationResult,
  AuthenticatedRequest,
} from '@task-platform/shared';

type UserRole = 'engineer' | 'manager' | 'admin' | 'supervisor';

interface User {
  id: string;
  email: string;
  passwordHash: string;
  name: string;
  roles: UserRole[];
  createdAt: string;
  updatedAt: string;
}

const config = getConfig();
const app = express();

const logger = createHttpLogger({
  serviceName: 'service-users',
  level: config.logLevel as never,
});

const users = new Map<string, User>();

const findUserByEmail = (email: string) => {
  for (const user of users.values()) {
    if (user.email === email) {
      return user;
    }
  }
  return undefined;
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

app.post('/register', async (req, res, next) => {
  try {
    const data = userRegistrationSchema.parse(req.body);

    if (findUserByEmail(data.email)) {
      throw new ConflictError('Email already registered');
    }

    const passwordHash = await bcrypt.hash(data.password, 10);
    const now = new Date().toISOString();
    const id = crypto.randomUUID();

    const user: User = {
      id,
      email: data.email,
      passwordHash,
      name: data.name,
      roles: ['engineer'],
      createdAt: now,
      updatedAt: now,
    };

    users.set(id, user);

    res.status(201).json({
      success: true,
      data: { id, email: user.email, name: user.name, roles: user.roles },
    });
  } catch (error) {
    next(error);
  }
});

app.post('/login', async (req, res, next) => {
  try {
    const data = userLoginSchema.parse(req.body);

    const user = findUserByEmail(data.email);
    if (!user) {
      throw new BadRequestError('Invalid credentials');
    }

    const valid = await bcrypt.compare(data.password, user.passwordHash);
    if (!valid) {
      throw new BadRequestError('Invalid credentials');
    }

    const token = signJwt({ sub: user.id, email: user.email, roles: user.roles });

    res.json({
      success: true,
      data: {
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          roles: user.roles,
        },
      },
    });
  } catch (error) {
    next(error);
  }
});

app.use(authenticate());

app.get('/me', (req: AuthenticatedRequest, res, next) => {
  try {
    const userId = req.user?.id;
    const user = userId ? users.get(userId) : undefined;
    if (!user) {
      throw new NotFoundError('User not found');
    }

    res.json({
      success: true,
      data: {
        id: user.id,
        email: user.email,
        name: user.name,
        roles: user.roles,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error) {
    next(error);
  }
});

app.patch('/me', async (req: AuthenticatedRequest, res, next) => {
  try {
    const data = userProfileUpdateSchema.parse(req.body);
    const userId = req.user?.id;
    const user = userId ? users.get(userId) : undefined;
    if (!user) {
      throw new NotFoundError('User not found');
    }

    if (data.roles && (!req.user?.roles.includes('admin') ?? true)) {
      throw new BadRequestError('Only admins can update roles');
    }

    const updatedUser = {
      ...user,
      name: data.name ?? user.name,
      roles: data.roles ? (data.roles as UserRole[]) : user.roles,
      updatedAt: new Date().toISOString(),
    };

    users.set(userId!, updatedUser);

    res.json({
      success: true,
      data: {
        id: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.name,
        roles: updatedUser.roles,
        createdAt: updatedUser.createdAt,
        updatedAt: updatedUser.updatedAt,
      },
    });
  } catch (error) {
    next(error);
  }
});

app.get('/', authorize(['admin']), (req: AuthenticatedRequest, res, next) => {
  try {
    const query = userQuerySchema.parse(req.query);
    const { page, pageSize, limit, offset } = getPaginationParams(query);

    let filteredUsers = Array.from(users.values());
    if (query.role) {
      filteredUsers = filteredUsers.filter((user) => user.roles.includes(query.role as UserRole));
    }
    if (query.email) {
      filteredUsers = filteredUsers.filter((user) => user.email.includes(query.email));
    }

    const total = filteredUsers.length;
    const items = filteredUsers.slice(offset, offset + limit).map((user) => ({
      id: user.id,
      email: user.email,
      name: user.name,
      roles: user.roles,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }));

    res.json({
      success: true,
      data: buildPaginationResult(items, total, page, pageSize),
    });
  } catch (error) {
    next(error);
  }
});

app.use(errorHandler);

const port = config.userServicePort;

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`User service running on port ${port}`);
});

export default app;

