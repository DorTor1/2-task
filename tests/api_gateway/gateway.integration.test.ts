import request from 'supertest';
import express from 'express';
import app from '../../api_gateway/src/server';

let server: express.Application;

beforeAll(() => {
  server = app;
});

describe('API Gateway', () => {
  it('responds to health check', async () => {
    const response = await request(server).get('/health');
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
  });
});
