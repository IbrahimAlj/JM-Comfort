const request = require('supertest');
const app = require('../app');

describe('POST /api/leads', () => {
  test('returns 400 when email is missing', async () => {
    const res = await request(app)
      .post('/api/leads')
      .send({
        name: 'John Doe',
        lead_type: 'contact',
        message: 'Need AC repair',
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe('Validation failed');
    expect(res.body.details).toContain('email is required');
  });

  test('returns 400 when email is invalid', async () => {
    const res = await request(app)
      .post('/api/leads')
      .send({
        name: 'John Doe',
        email: 'bademail',
        lead_type: 'contact',
        message: 'Need AC repair',
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe('Validation failed');
    expect(res.body.details).toContain('email must be valid');
  });
});