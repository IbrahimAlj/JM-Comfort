const express = require('express');

jest.mock('../config/db', () => ({ execute: jest.fn() }));
jest.mock('../config/database', () => ({ query: jest.fn(), getConnection: jest.fn() }));

const pool = require('../config/db');
const db = require('../config/database');
const appointmentRoutes = require('../routes/appointments');

function createApp() {
  const app = express();
  app.use(express.json());
  app.use('/api/appointments', appointmentRoutes);
  return app;
}

function makeRequest(app, method, path, body) {
  return new Promise((resolve) => {
    const server = app.listen(0, () => {
      const port = server.address().port;
      const url = `http://localhost:${port}${path}`;
      const options = { method, headers: { 'Content-Type': 'application/json' } };
      if (body) options.body = JSON.stringify(body);
      fetch(url, options)
        .then(async (res) => {
          const data = await res.json();
          server.close();
          resolve({ status: res.status, body: data });
        })
        .catch((err) => {
          server.close();
          resolve({ status: 500, body: { error: err.message } });
        });
    });
  });
}

const FUTURE_START = '2030-06-15T10:00:00';
const FUTURE_END = '2030-06-15T11:00:00';

describe('POST /api/appointments', () => {
  let app;

  beforeEach(() => {
    app = createApp();
    jest.clearAllMocks();
  });

  test('returns 201 with appointment_id on success', async () => {
    pool.execute
      .mockResolvedValueOnce([[]])
      .mockResolvedValueOnce([{ insertId: 42 }]);

    const res = await makeRequest(app, 'POST', '/api/appointments', {
      customer_id: 1,
      scheduled_at: FUTURE_START,
      end_at: FUTURE_END,
    });

    expect(res.status).toBe(201);
    expect(res.body.message).toBe('Appointment created successfully');
    expect(res.body.appointment_id).toBe(42);
  });

  test('returns 400 when customer_id is missing', async () => {
    const res = await makeRequest(app, 'POST', '/api/appointments', {
      scheduled_at: FUTURE_START,
      end_at: FUTURE_END,
    });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Validation failed');
    expect(res.body.details).toContain('customer_id is required');
  });

  test('returns 400 when scheduled_at is missing', async () => {
    const res = await makeRequest(app, 'POST', '/api/appointments', {
      customer_id: 1,
      end_at: FUTURE_END,
    });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Validation failed');
    expect(res.body.details).toContain('scheduled_at is required');
  });

  test('returns 400 when end_at is missing', async () => {
    const res = await makeRequest(app, 'POST', '/api/appointments', {
      customer_id: 1,
      scheduled_at: FUTURE_START,
    });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Validation failed');
    expect(res.body.details).toContain('end_at is required');
  });

  test('returns 400 when scheduled_at is in the past', async () => {
    const res = await makeRequest(app, 'POST', '/api/appointments', {
      customer_id: 1,
      scheduled_at: '2020-01-01T10:00:00',
      end_at: '2020-01-01T11:00:00',
    });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Validation failed');
    expect(res.body.details).toContain('scheduled_at must not be in the past');
  });

  test('returns 409 when appointment overlaps with existing', async () => {
    pool.execute.mockResolvedValueOnce([[{ id: 10 }]]);

    const res = await makeRequest(app, 'POST', '/api/appointments', {
      customer_id: 1,
      scheduled_at: FUTURE_START,
      end_at: FUTURE_END,
    });

    expect(res.status).toBe(409);
    expect(res.body.error).toBe('Scheduling conflict');
    expect(res.body.conflicting_appointment_id).toBe(10);
  });
});

describe('GET /api/appointments', () => {
  let app;

  beforeEach(() => {
    app = createApp();
    jest.clearAllMocks();
  });

  test('returns 200 with list of appointments', async () => {
    const mockAppointments = [
      { id: 1, customer_name: 'John Doe', status: 'pending' },
      { id: 2, customer_name: 'Jane Smith', status: 'approved' },
    ];
    db.query.mockResolvedValueOnce([mockAppointments]);

    const res = await makeRequest(app, 'GET', '/api/appointments');

    expect(res.status).toBe(200);
    expect(res.body).toEqual(mockAppointments);
    expect(res.body).toHaveLength(2);
  });

  test('returns 200 with empty array when no appointments exist', async () => {
    db.query.mockResolvedValueOnce([[]]);

    const res = await makeRequest(app, 'GET', '/api/appointments');

    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });
});
