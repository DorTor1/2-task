import express from 'express';
import request from 'supertest';
import { createUserServiceApp } from '../../service_users/src/app';

let app: express.Application;

beforeAll(async () => {
  const result = await createUserServiceApp();
  app = result.app;
});

describe('User service authentication flow', () => {
  it('registers a new user', async () => {
    const response = await request(app)
      .post('/register')
      .send({
        email: 'test@example.com',
        password: 'Password123',
        name: 'Test User',
      });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data.email).toBe('test@example.com');
  });

  it('fails to register with duplicate email', async () => {
    await request(app).post('/register').send({
      email: 'dup@example.com',
      password: 'Password123',
      name: 'Dup User',
    });

    const dupResponse = await request(app).post('/register').send({
      email: 'dup@example.com',
      password: 'Password123',
      name: 'Dup User',
    });

    expect(dupResponse.status).toBe(409);
    expect(dupResponse.body.success).toBe(false);
  });

  it('authenticates registered user and returns token', async () => {
    await request(app).post('/register').send({
      email: 'auth@example.com',
      password: 'Password123',
      name: 'Auth User',
    });

    const loginResponse = await request(app).post('/login').send({
      email: 'auth@example.com',
      password: 'Password123',
    });

    expect(loginResponse.status).toBe(200);
    expect(loginResponse.body.success).toBe(true);
    expect(typeof loginResponse.body.data.token).toBe('string');
  });
});
