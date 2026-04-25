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

function mockNoDupeThenInsert(insertId) {
  pool.execute
    .mockResolvedValueOnce([[]]) // dedupe SELECT — empty
    .mockResolvedValueOnce([{ insertId }]); // INSERT
}

describe('Sanitization middleware - leads route', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('strips script tags from message before saving', async () => {
    mockNoDupeThenInsert(1);

    await request(app)
      .post('/api/leads')
      .send({
        name: 'Alice',
        email: 'alice@example.com',
        lead_type: 'contact',
        message: '<script>alert("xss")</script>Hello',
      });

    const insertCall = findInsertCall();
    const message = insertCall[1][7];
    expect(message).not.toContain('<script>');
    expect(message).not.toContain('</script>');
  });

  test('strips onerror event attribute from name field', async () => {
    mockNoDupeThenInsert(2);

    await request(app)
      .post('/api/leads')
      .send({
        name: '<img src=x onerror=alert(1)>Bob',
        email: 'bob@example.com',
        lead_type: 'contact',
      });

    const insertCall = findInsertCall();
    const savedName = insertCall[1][2];
    expect(savedName).not.toContain('onerror');
  });

  test('strips javascript: href from message field', async () => {
    mockNoDupeThenInsert(3);

    await request(app)
      .post('/api/leads')
      .send({
        name: 'Carol',
        email: 'carol@example.com',
        lead_type: 'contact',
        message: '<a href="javascript:void(0)">click</a>',
      });

    const insertCall = findInsertCall();
    const message = insertCall[1][7];
    expect(message).not.toContain('javascript:');
  });

  test('SQL injection style input does not break the route', async () => {
    mockNoDupeThenInsert(4);

    const res = await request(app)
      .post('/api/leads')
      .send({
        name: "Dan'; DROP TABLE contact_leads; --",
        email: 'dan@example.com',
        lead_type: 'contact',
        message: "1' OR '1'='1",
      });

    expect(res.statusCode).toBe(201);
    expect(findInsertCall()).toBeDefined();
  });

  test('plain text fields pass through unchanged', async () => {
    mockNoDupeThenInsert(5);

    await request(app)
      .post('/api/leads')
      .send({
        name: 'Eve Davis',
        email: 'eve@example.com',
        lead_type: 'contact',
        message: 'I need HVAC maintenance scheduled.',
      });

    const insertCall = findInsertCall();
    const params = insertCall[1];
    expect(params).toContain('I need HVAC maintenance scheduled.');
    expect(params).toContain('eve@example.com');
  });

  test('iframe injection is stripped from message', async () => {
    mockNoDupeThenInsert(6);

    await request(app)
      .post('/api/leads')
      .send({
        name: 'Frank Hill',
        email: 'frank@example.com',
        lead_type: 'contact',
        message: '<iframe src="evil.com"></iframe>Need service.',
      });

    const insertCall = findInsertCall();
    const message = insertCall[1][7];
    expect(message).not.toContain('<iframe');
  });
});
