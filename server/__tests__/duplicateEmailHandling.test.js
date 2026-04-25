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

describe('POST /api/leads - duplicate email handling', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('first submission with unique payload returns 201', async () => {
    pool.execute
      .mockResolvedValueOnce([[]]) // dedupe SELECT — no duplicates
      .mockResolvedValueOnce([{ insertId: 1 }]); // INSERT

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

  test('duplicate submission within window returns 200 with deduped true', async () => {
    // Dedupe SELECT finds an existing row
    pool.execute.mockResolvedValueOnce([[{ id: 7 }]]);

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
    pool.execute
      .mockResolvedValueOnce([[]])
      .mockResolvedValueOnce([{ insertId: 2 }]);

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

  test('insert SQL is parameterized and includes dedupe_hash', async () => {
    pool.execute
      .mockResolvedValueOnce([[]])
      .mockResolvedValueOnce([{ insertId: 11 }]);

    await request(app)
      .post('/api/leads')
      .send({
        name: 'Bob White',
        email: 'bob@example.com',
        lead_type: 'quote',
        service_type: 'AC Repair',
      });

    const insertCall = findInsertCall();
    expect(insertCall).toBeDefined();
    const [sql] = insertCall;
    expect(sql).toMatch(/INSERT INTO contact_leads/);
    expect(sql).toMatch(/dedupe_hash/);
  });

  test('email is normalized to lowercase before persisting', async () => {
    pool.execute
      .mockResolvedValueOnce([[]])
      .mockResolvedValueOnce([{ insertId: 3 }]);

    await request(app)
      .post('/api/leads')
      .send({
        name: 'Carol Hall',
        email: 'CAROL@EXAMPLE.COM',
        lead_type: 'contact',
        message: 'Hello.',
      });

    const insertCall = findInsertCall();
    const params = insertCall[1];
    expect(params).toContain('carol@example.com');
    expect(params).not.toContain('CAROL@EXAMPLE.COM');
  });

  test('quote duplicate within window returns 200 with deduped flag', async () => {
    pool.execute.mockResolvedValueOnce([[{ id: 8 }]]);

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
