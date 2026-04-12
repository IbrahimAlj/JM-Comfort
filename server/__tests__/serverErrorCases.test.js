const request = require('supertest');

jest.mock('../config/db', () => ({
  execute: jest.fn(),
}));

const pool = require('../config/db');
const app = require('../app');

describe('POST /api/leads - server error cases', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('returns 500 when database throws on contact submission', async () => {
    pool.execute.mockRejectedValueOnce(new Error('DB connection lost'));

    const res = await request(app)
      .post('/api/leads')
      .send({
        name: 'Mike Taylor',
        email: 'mike@example.com',
        lead_type: 'contact',
        message: 'I need service.',
      });

    expect(res.statusCode).toBe(500);
    expect(res.body.error).toBe('Internal server error');
  });

  test('returns 500 when database throws on quote submission', async () => {
    pool.execute.mockRejectedValueOnce(new Error('Timeout'));

    const res = await request(app)
      .post('/api/leads')
      .send({
        name: 'Nancy Green',
        email: 'nancy@example.com',
        lead_type: 'quote',
        service_type: 'AC Repair',
        message: 'Please quote.',
      });

    expect(res.statusCode).toBe(500);
    expect(res.body.error).toBe('Internal server error');
  });

  test('does not expose internal error details in the response', async () => {
    pool.execute.mockRejectedValueOnce(new Error('ECONNREFUSED 127.0.0.1:3306'));

    const res = await request(app)
      .post('/api/leads')
      .send({
        name: 'Oscar Hall',
        email: 'oscar@example.com',
        lead_type: 'contact',
        message: 'Test.',
      });

    expect(res.statusCode).toBe(500);
    expect(JSON.stringify(res.body)).not.toContain('ECONNREFUSED');
  });

  test('returns 500 on unexpected null result from database', async () => {
    pool.execute.mockResolvedValueOnce([null]);

    const res = await request(app)
      .post('/api/leads')
      .send({
        name: 'Paula Young',
        email: 'paula@example.com',
        lead_type: 'contact',
        message: 'Test.',
      });

    // null result means insertId check throws, so server returns 500
    expect(res.statusCode).toBe(500);
    expect(res.body.error).toBe('Internal server error');
  });
});
