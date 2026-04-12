const request = require('supertest');
const app = require('../app');
const pool = require('../config/database');

afterEach(() => {
  jest.restoreAllMocks();
});

// successful service get 
describe('GET /api/services/:id', () => {
  test('returns 200 and service object for valid id', async () => {
    // demo info 
    jest.spyOn(pool, 'query').mockResolvedValue([
      [
        {
          id: 1,
          name: 'Test Service',
          full_description: 'Full description here',
          short_description: 'Short desc',
          image_url: '/images/test.jpg',
        },
      ],
    ]);

    const res = await request(app).get('/api/services/1');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('name', 'Test Service');
    expect(res.body).toHaveProperty('description', 'Full description here');
    expect(res.body).toHaveProperty('image', '/images/test.jpg');
  });

  // ID being an int is valid, but an invalid ID
  test('returns 404 for non-existent id', async () => {
    jest.spyOn(pool, 'query').mockResolvedValue([[]]); // no rows
    const res = await request(app).get('/api/services/999999');
    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('message', 'Service not found');    
  });

  // The ID is straight up invalid (non-int)
  test('returns 400 for invalid service id format', async () => {
    const res = await request(app).get('/api/services/abc');
    expect(res.statusCode).toBe(400);
  });

});