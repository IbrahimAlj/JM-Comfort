const request = require('supertest');

jest.mock('../config/db', () => ({
  execute: jest.fn(),
}));

const app = require('../app');

describe('POST /api/leads - validation failures', () => {
  test('returns 400 when email is missing', async () => {
    const res = await request(app)
      .post('/api/leads')
      .send({
        name: 'Grace Lee',
        lead_type: 'contact',
        message: 'Hello.',
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe('Validation failed');
    expect(res.body.details).toContain('email is required');
  });

  test('returns 400 when email is invalid', async () => {
    const res = await request(app)
      .post('/api/leads')
      .send({
        name: 'Grace Lee',
        email: 'not-an-email',
        lead_type: 'contact',
        message: 'Hello.',
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe('Validation failed');
    expect(res.body.details).toContain('email must be valid');
  });

  test('returns 400 when email exceeds 100 characters', async () => {
    const longEmail = 'a'.repeat(95) + '@b.com';
    const res = await request(app)
      .post('/api/leads')
      .send({
        name: 'Grace Lee',
        email: longEmail,
        lead_type: 'contact',
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe('Validation failed');
    expect(res.body.details).toContain('email must not exceed 100 characters');
  });

  test('returns 400 when no name field is provided', async () => {
    const res = await request(app)
      .post('/api/leads')
      .send({
        email: 'henry@example.com',
        lead_type: 'contact',
        message: 'Hello.',
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe('Validation failed');
    expect(res.body.details).toContain('name or first_name/last_name is required');
  });

  test('returns 400 when lead_type is invalid', async () => {
    const res = await request(app)
      .post('/api/leads')
      .send({
        name: 'Iris Stone',
        email: 'iris@example.com',
        lead_type: 'unknown',
        message: 'Hello.',
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe('Validation failed');
    expect(res.body.details).toContain('lead_type must be one of: contact, quote');
  });

  test('returns 400 when name exceeds 120 characters', async () => {
    const res = await request(app)
      .post('/api/leads')
      .send({
        name: 'J'.repeat(121),
        email: 'jack@example.com',
        lead_type: 'contact',
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe('Validation failed');
    expect(res.body.details).toContain('name must not exceed 120 characters');
  });

  test('returns 400 when message exceeds 5000 characters', async () => {
    const res = await request(app)
      .post('/api/leads')
      .send({
        name: 'Karen White',
        email: 'karen@example.com',
        lead_type: 'contact',
        message: 'M'.repeat(5001),
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe('Validation failed');
    expect(res.body.details).toContain('message must not exceed 5000 characters');
  });

  test('returns 400 when service_type exceeds 80 characters', async () => {
    const res = await request(app)
      .post('/api/leads')
      .send({
        name: 'Leo Clark',
        email: 'leo@example.com',
        lead_type: 'quote',
        service_type: 'S'.repeat(81),
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe('Validation failed');
    expect(res.body.details).toContain('service_type must not exceed 80 characters');
  });

  test('returns multiple validation errors when multiple fields are invalid', async () => {
    const res = await request(app)
      .post('/api/leads')
      .send({
        email: 'bademail',
        lead_type: 'unknown',
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe('Validation failed');
    expect(res.body.details.length).toBeGreaterThan(1);
  });
});
