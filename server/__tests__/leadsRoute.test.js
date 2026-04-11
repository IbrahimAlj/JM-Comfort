const request = require('supertest');

jest.mock('../config/db', () => ({
  execute: jest.fn(),
}));

const pool = require('../config/db');
const app = require('../app');

const ADMIN_KEY = 'test-admin-key';

beforeAll(() => {
  process.env.ADMIN_API_KEY = ADMIN_KEY;
});

afterAll(() => {
  delete process.env.ADMIN_API_KEY;
});

describe('GET /api/leads/admin/leads', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('returns leads list when admin key is valid', async () => {
    const mockLeads = [
      { id: 1, name: 'Alice', email: 'alice@example.com', lead_type: 'contact' },
      { id: 2, name: 'Bob', email: 'bob@example.com', lead_type: 'quote' },
    ];
    pool.execute.mockResolvedValueOnce([mockLeads]);

    const res = await request(app)
      .get('/api/leads/admin/leads')
      .set('x-admin-key', ADMIN_KEY);

    expect(res.statusCode).toBe(200);
    expect(res.body.ok).toBe(true);
    expect(res.body.leads).toHaveLength(2);
    expect(res.body.leads[0].email).toBe('alice@example.com');
  });

  test('returns 403 when admin key is missing', async () => {
    const res = await request(app)
      .get('/api/leads/admin/leads');

    expect(res.statusCode).toBe(403);
  });

  test('returns 403 when admin key is wrong', async () => {
    const res = await request(app)
      .get('/api/leads/admin/leads')
      .set('x-admin-key', 'wrong-key');

    expect(res.statusCode).toBe(403);
    expect(res.body.error).toBe('forbidden');
  });

  test('returns empty leads array when no leads exist', async () => {
    pool.execute.mockResolvedValueOnce([[]]);

    const res = await request(app)
      .get('/api/leads/admin/leads')
      .set('x-admin-key', ADMIN_KEY);

    expect(res.statusCode).toBe(200);
    expect(res.body.ok).toBe(true);
    expect(res.body.leads).toEqual([]);
  });

  test('accepts Authorization Bearer token', async () => {
    pool.execute.mockResolvedValueOnce([[{ id: 1, name: 'Carol' }]]);

    const res = await request(app)
      .get('/api/leads/admin/leads')
      .set('Authorization', `Bearer ${ADMIN_KEY}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.ok).toBe(true);
  });

  test('returns 500 when database throws', async () => {
    pool.execute.mockRejectedValueOnce(new Error('DB error'));

    const res = await request(app)
      .get('/api/leads/admin/leads')
      .set('x-admin-key', ADMIN_KEY);

    expect(res.statusCode).toBe(500);
    expect(res.body.error).toBe('Internal server error');
  });
});

describe('GET /api/leads/admin/leads/:id', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('returns a single lead by id', async () => {
    const mockLead = { id: 5, name: 'Dan', email: 'dan@example.com' };
    pool.execute.mockResolvedValueOnce([[mockLead]]);

    const res = await request(app)
      .get('/api/leads/admin/leads/5')
      .set('x-admin-key', ADMIN_KEY);

    expect(res.statusCode).toBe(200);
    expect(res.body.ok).toBe(true);
    expect(res.body.lead.email).toBe('dan@example.com');
  });

  test('returns 404 when lead does not exist', async () => {
    pool.execute.mockResolvedValueOnce([[]]);

    const res = await request(app)
      .get('/api/leads/admin/leads/999')
      .set('x-admin-key', ADMIN_KEY);

    expect(res.statusCode).toBe(404);
    expect(res.body.error).toBe('not found');
  });

  test('returns 400 for non-numeric id', async () => {
    const res = await request(app)
      .get('/api/leads/admin/leads/abc')
      .set('x-admin-key', ADMIN_KEY);

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe('invalid id');
  });
});
