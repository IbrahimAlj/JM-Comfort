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

describe('POST /api/leads - contact form success', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('creates a contact lead and returns 201', async () => {
    pool.execute
      .mockResolvedValueOnce([[]]) // dedupe SELECT
      .mockResolvedValueOnce([{ insertId: 1 }]); // INSERT

    const res = await request(app)
      .post('/api/leads')
      .send({
        name: 'Alice Smith',
        email: 'alice@example.com',
        lead_type: 'contact',
        message: 'I need help with my HVAC system.',
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe('Lead created successfully');
    expect(res.body.lead_id).toBe(1);
  });

  test('returns 200 with deduped flag when duplicate contact is submitted', async () => {
    // Dedupe SELECT finds an existing row within window
    pool.execute.mockResolvedValueOnce([[{ id: 99 }]]);

    const res = await request(app)
      .post('/api/leads')
      .send({
        name: 'Alice Smith',
        email: 'alice@example.com',
        lead_type: 'contact',
        message: 'I need help with my HVAC system.',
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.ok).toBe(true);
    expect(res.body.deduped).toBe(true);
  });

  test('saves the correct fields to the database', async () => {
    pool.execute
      .mockResolvedValueOnce([[]])
      .mockResolvedValueOnce([{ insertId: 2 }]);

    await request(app)
      .post('/api/leads')
      .send({
        name: 'Bob Jones',
        email: 'bob@example.com',
        phone: '5551234567',
        lead_type: 'contact',
        message: 'Schedule a service visit.',
        source: 'website',
      });

    const insertCall = findInsertCall();
    expect(insertCall).toBeDefined();
    const [sql, params] = insertCall;
    expect(sql).toMatch(/INSERT INTO contact_leads/);
    expect(params).toContain('bob@example.com');
    expect(params).toContain('contact');
    expect(params).toContain('Schedule a service visit.');
  });

  test('trims whitespace from submitted fields', async () => {
    pool.execute
      .mockResolvedValueOnce([[]])
      .mockResolvedValueOnce([{ insertId: 3 }]);

    const res = await request(app)
      .post('/api/leads')
      .send({
        name: '  Carol White  ',
        email: '  carol@example.com  ',
        lead_type: 'contact',
        message: '  Need an estimate.  ',
      });

    expect(res.statusCode).toBe(201);
    const insertCall = findInsertCall();
    const params = insertCall[1];
    expect(params).toContain('carol@example.com');
    expect(params).toContain('Need an estimate.');
  });
});
