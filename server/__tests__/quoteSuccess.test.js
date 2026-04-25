const request = require('supertest');

jest.mock('../config/db', () => ({
  execute: jest.fn(),
}));

const pool = require('../config/db');
const app = require('../app');

function findInsertCall() {
  return pool.execute.mock.calls.find((c) =>
    String(c[0]).includes('INSERT INTO contact_leads')
  );
}

describe('POST /api/leads - quote form success', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('creates a quote lead and returns 201', async () => {
    pool.execute
      .mockResolvedValueOnce([[]])
      .mockResolvedValueOnce([{ insertId: 1 }]);

    const res = await request(app)
      .post('/api/leads')
      .send({
        name: 'David Brown',
        email: 'david@example.com',
        lead_type: 'quote',
        service_type: 'AC Installation',
        message: 'Please provide a quote for a new AC unit.',
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe('Lead created successfully');
    expect(res.body.lead_id).toBe(1);
  });

  test('returns 200 with deduped flag when duplicate quote is submitted', async () => {
    pool.execute.mockResolvedValueOnce([[{ id: 99 }]]);

    const res = await request(app)
      .post('/api/leads')
      .send({
        name: 'David Brown',
        email: 'david@example.com',
        lead_type: 'quote',
        service_type: 'AC Installation',
        message: 'Please provide a quote for a new AC unit.',
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.ok).toBe(true);
    expect(res.body.deduped).toBe(true);
  });

  test('saves service_type to the database for a quote request', async () => {
    pool.execute
      .mockResolvedValueOnce([[]])
      .mockResolvedValueOnce([{ insertId: 2 }]);

    await request(app)
      .post('/api/leads')
      .send({
        name: 'Emma Davis',
        email: 'emma@example.com',
        lead_type: 'quote',
        service_type: 'Heating Repair',
        message: 'Furnace not working.',
      });

    const insertCall = findInsertCall();
    expect(insertCall).toBeDefined();
    const [sql, params] = insertCall;
    expect(sql).toMatch(/INSERT INTO contact_leads/);
    expect(params).toContain('emma@example.com');
    expect(params).toContain('quote');
    expect(params).toContain('Heating Repair');
  });

  test('accepts a quote with first_name and last_name instead of name', async () => {
    pool.execute
      .mockResolvedValueOnce([[]])
      .mockResolvedValueOnce([{ insertId: 3 }]);

    const res = await request(app)
      .post('/api/leads')
      .send({
        first_name: 'Frank',
        last_name: 'Miller',
        email: 'frank@example.com',
        lead_type: 'quote',
        service_type: 'Ventilation',
        message: 'Need ventilation system checked.',
      });

    expect(res.statusCode).toBe(201);
    const insertCall = findInsertCall();
    const params = insertCall[1];
    expect(params).toContain('Frank');
    expect(params).toContain('Miller');
  });
});
