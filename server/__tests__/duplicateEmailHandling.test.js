const request = require('supertest');
const crypto = require('crypto');

jest.mock('../config/db', () => ({
  execute: jest.fn(),
}));

const pool = require('../config/db');
const app = require('../app');

describe('POST /api/leads - duplicate email handling', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('first submission with unique payload returns 201', async () => {
    pool.execute.mockResolvedValueOnce([{ insertId: 1 }]);

    const res = await request(app)
      .post('/api/leads')
      .send({
        name: 'Alice Green',
        email: 'alice@example.com',
        lead_type: 'contact',
        message: 'First request.',
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.lead_id).toBe(1);
  });

  test('duplicate submission returns 200 with deduped true', async () => {
    pool.execute.mockResolvedValueOnce([{ insertId: 0 }]);

    const res = await request(app)
      .post('/api/leads')
      .send({
        name: 'Alice Green',
        email: 'alice@example.com',
        lead_type: 'contact',
        message: 'First request.',
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.ok).toBe(true);
    expect(res.body.deduped).toBe(true);
  });

  test('same email with different message is treated as new lead', async () => {
    pool.execute.mockResolvedValueOnce([{ insertId: 2 }]);

    const res = await request(app)
      .post('/api/leads')
      .send({
        name: 'Alice Green',
        email: 'alice@example.com',
        lead_type: 'contact',
        message: 'A different message this time.',
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.lead_id).toBe(2);
  });

  test('deduplication uses ON DUPLICATE KEY UPDATE in SQL', async () => {
    pool.execute.mockResolvedValueOnce([{ insertId: 0 }]);

    await request(app)
      .post('/api/leads')
      .send({
        name: 'Bob White',
        email: 'bob@example.com',
        lead_type: 'quote',
        service_type: 'AC Repair',
      });

    expect(pool.execute).toHaveBeenCalledTimes(1);
    const [sql] = pool.execute.mock.calls[0];
    expect(sql).toMatch(/ON DUPLICATE KEY UPDATE/i);
  });

  test('email is normalized to lowercase before deduplication', async () => {
    pool.execute.mockResolvedValueOnce([{ insertId: 3 }]);

    await request(app)
      .post('/api/leads')
      .send({
        name: 'Carol Hall',
        email: 'CAROL@EXAMPLE.COM',
        lead_type: 'contact',
        message: 'Hello.',
      });

    expect(pool.execute).toHaveBeenCalledTimes(1);
    const [, params] = pool.execute.mock.calls[0];
    expect(params).toContain('carol@example.com');
    expect(params).not.toContain('CAROL@EXAMPLE.COM');
  });

  test('quote duplicate returns 200 with deduped flag', async () => {
    pool.execute.mockResolvedValueOnce([{ insertId: 0 }]);

    const res = await request(app)
      .post('/api/leads')
      .send({
        name: 'Dan Clark',
        email: 'dan@example.com',
        lead_type: 'quote',
        service_type: 'Heating',
        message: 'Need a quote.',
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.deduped).toBe(true);
  });
});
