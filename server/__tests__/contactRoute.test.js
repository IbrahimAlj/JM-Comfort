const request = require('supertest');

jest.mock('../config/db', () => ({
  execute: jest.fn(),
}));

const pool = require('../config/db');
const app = require('../app');

describe('POST /api/leads - contact route', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('valid contact submission returns 201', async () => {
    pool.execute.mockResolvedValueOnce([{ insertId: 1 }]);

    const res = await request(app)
      .post('/api/leads')
      .send({
        name: 'Alice Smith',
        email: 'alice@example.com',
        lead_type: 'contact',
        message: 'I need help with my AC unit.',
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe('Lead created successfully');
    expect(res.body.lead_id).toBe(1);
  });

  test('returns 400 when email is missing', async () => {
    const res = await request(app)
      .post('/api/leads')
      .send({
        name: 'Bob Jones',
        lead_type: 'contact',
        message: 'Need service.',
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe('Validation failed');
    expect(res.body.details).toContain('email is required');
  });

  test('returns 400 when name is missing', async () => {
    const res = await request(app)
      .post('/api/leads')
      .send({
        email: 'carol@example.com',
        lead_type: 'contact',
        message: 'Need service.',
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe('Validation failed');
    expect(res.body.details).toContain('name or first_name/last_name is required');
  });

  test('returns 400 when email format is invalid', async () => {
    const res = await request(app)
      .post('/api/leads')
      .send({
        name: 'Dan White',
        email: 'not-valid',
        lead_type: 'contact',
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe('Validation failed');
    expect(res.body.details).toContain('email must be valid');
  });

  test('sanitizes XSS script tags from message field', async () => {
    pool.execute.mockResolvedValueOnce([{ insertId: 5 }]);

    await request(app)
      .post('/api/leads')
      .send({
        name: 'Eve Black',
        email: 'eve@example.com',
        lead_type: 'contact',
        message: '<script>alert("xss")</script>Need help.',
      });

    expect(pool.execute).toHaveBeenCalledTimes(1);
    const [, params] = pool.execute.mock.calls[0];
    const savedMessage = params[7];
    expect(savedMessage).not.toContain('<script>');
    expect(savedMessage).not.toContain('</script>');
  });

  test('sanitizes XSS from name field', async () => {
    pool.execute.mockResolvedValueOnce([{ insertId: 6 }]);

    await request(app)
      .post('/api/leads')
      .send({
        name: '<img src=x onerror=alert(1)>Frank',
        email: 'frank@example.com',
        lead_type: 'contact',
      });

    expect(pool.execute).toHaveBeenCalledTimes(1);
    const [, params] = pool.execute.mock.calls[0];
    const savedName = params[2];
    expect(savedName).not.toContain('onerror');
  });
});
