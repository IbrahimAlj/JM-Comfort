const request = require('supertest');
const app = require('../app');
const pool = require('../config/database');

afterEach(() => {
  jest.restoreAllMocks();
});

describe('GET /api/services/:id', () => {
  test('returns 200 and service object for valid id', async () => {
    jest.spyOn(pool, 'query').mockResolvedValue([
      [
        {
          id: 1,
          name: 'Test Service',
          slug: 'test-service',
          short_description: 'Short desc',
          full_description: 'Full description here',
          price_starting: 100,
          price_description: 'Starting at $100',
          image_url: '/images/test.jpg',
          is_active: 1,
        },
      ],
    ]);

    const res = await request(app).get('/api/services/1');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('name', 'Test Service');
    expect(res.body).toHaveProperty('title', 'Test Service');
    expect(res.body).toHaveProperty('description', 'Full description here');
    expect(res.body).toHaveProperty('image', '/images/test.jpg');
    expect(res.body).toHaveProperty('image_url', '/images/test.jpg');
  });

  test('returns 404 for non-existent id', async () => {
    jest.spyOn(pool, 'query').mockResolvedValue([[]]);
    const res = await request(app).get('/api/services/999999');
    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('error', 'Service not found');
  });

  test('returns 400 for invalid service id format', async () => {
    const res = await request(app).get('/api/services/abc');
    expect(res.statusCode).toBe(400);
  });
});
