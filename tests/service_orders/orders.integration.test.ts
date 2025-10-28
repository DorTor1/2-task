import express from 'express';
import request from 'supertest';
import { createOrderServiceApp } from '../../service_orders/src/app';
import { signJwt } from '@task-platform/shared';

let app: express.Application;
let token: string;
let userId: string;

beforeAll(async () => {
  const result = await createOrderServiceApp();
  app = result.app;
  userId = '00000000-0000-0000-0000-000000000001';
  token = signJwt({ sub: userId, email: 'user@example.com', roles: ['engineer'] });
});

describe('Order service basic flow', () => {
  it('creates an order for authenticated user', async () => {
    const response = await request(app)
      .post('/')
      .set('Authorization', `Bearer ${token}`)
      .send({
        items: [
          { productId: 'p1', name: 'Item 1', quantity: 2, price: 100 },
        ],
      });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data.status).toBe('created');
  });

  it('lists orders for current user', async () => {
    const response = await request(app)
      .get('/')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(Array.isArray(response.body.data.items)).toBe(true);
  });
});
