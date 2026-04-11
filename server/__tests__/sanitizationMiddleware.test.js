const request = require('supertest');

jest.mock('../config/db', () => ({
  execute: jest.fn(),
}));

const pool = require('../config/db');
const app = require('../app');

describe('Sanitization middleware - leads route', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('strips script tags from message before saving', async () => {
    pool.execute.mockResolvedValueOnce([{ insertId: 1 }]);

    await request(app)
      .post('/api/leads')
      .send({
        name: 'Alice',
        email: 'alice@example.com',
        lead_type: 'contact',
        message: '<script>alert("xss")</script>Hello',
      });

    const [, params] = pool.execute.mock.calls[0];
    const message = params[7];
    expect(message).not.toContain('<script>');
    expect(message).not.toContain('</script>');
  });

  test('strips onerror event attribute from name field', async () => {
    pool.execute.mockResolvedValueOnce([{ insertId: 2 }]);

    await request(app)
      .post('/api/leads')
      .send({
        name: '<img src=x onerror=alert(1)>Bob',
        email: 'bob@example.com',
        lead_type: 'contact',
      });

    const [, params] = pool.execute.mock.calls[0];
    const savedName = params[2];
    expect(savedName).not.toContain('onerror');
  });

  test('strips javascript: href from message field', async () => {
    pool.execute.mockResolvedValueOnce([{ insertId: 3 }]);

    await request(app)
      .post('/api/leads')
      .send({
        name: 'Carol',
        email: 'carol@example.com',
        lead_type: 'contact',
        message: '<a href="javascript:void(0)">click</a>',
      });

    const [, params] = pool.execute.mock.calls[0];
    const message = params[7];
    expect(message).not.toContain('javascript:');
  });

  test('SQL injection style input does not break the route', async () => {
    pool.execute.mockResolvedValueOnce([{ insertId: 4 }]);

    const res = await request(app)
      .post('/api/leads')
      .send({
        name: "Dan'; DROP TABLE contact_leads; --",
        email: 'dan@example.com',
        lead_type: 'contact',
        message: "1' OR '1'='1",
      });

    expect(res.statusCode).toBe(201);
    expect(pool.execute).toHaveBeenCalledTimes(1);
  });

  test('plain text fields pass through unchanged', async () => {
    pool.execute.mockResolvedValueOnce([{ insertId: 5 }]);

    await request(app)
      .post('/api/leads')
      .send({
        name: 'Eve Davis',
        email: 'eve@example.com',
        lead_type: 'contact',
        message: 'I need HVAC maintenance scheduled.',
      });

    const [, params] = pool.execute.mock.calls[0];
    expect(params).toContain('I need HVAC maintenance scheduled.');
    expect(params).toContain('eve@example.com');
  });

  test('iframe injection is stripped from message', async () => {
    pool.execute.mockResolvedValueOnce([{ insertId: 6 }]);

    await request(app)
      .post('/api/leads')
      .send({
        name: 'Frank Hill',
        email: 'frank@example.com',
        lead_type: 'contact',
        message: '<iframe src="evil.com"></iframe>Need service.',
      });

    const [, params] = pool.execute.mock.calls[0];
    const message = params[7];
    expect(message).not.toContain('<iframe');
  });
});
