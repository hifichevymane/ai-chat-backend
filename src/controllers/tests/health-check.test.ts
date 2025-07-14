import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../../app';

describe('Health Check Endpoint', () => {
  it('should return 200', async () => {
    const response = await request(app).get('/api/health-check');
    expect(response.statusCode).toBe(200);
  });
});
