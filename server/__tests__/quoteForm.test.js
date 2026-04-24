const express = require("express");

// Mock the db pool before requiring the route
jest.mock("../config/db", () => ({
  execute: jest.fn(),
}));

// Mock mailer in case it gets imported by leads route
jest.mock("../config/mailer", () => ({
  sendEmail: jest.fn().mockResolvedValue({ messageId: "test-id" }),
  validateEmailConfig: jest.fn(),
  createTransporter: jest.fn(),
}));

const pool = require("../config/db");
const leadsRoutes = require("../routes/leads");

function createApp() {
  const app = express();
  app.use(express.json());
  app.use("/api/leads", leadsRoutes);
  return app;
}

function makeRequest(app, method, path, body) {
  return new Promise((resolve) => {
    const server = app.listen(0, () => {
      const port = server.address().port;
      const url = `http://localhost:${port}${path}`;
      const options = {
        method,
        headers: { "Content-Type": "application/json" },
      };
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

describe("POST /api/leads (quote form)", () => {
  let app;

  beforeEach(() => {
    app = createApp();
    jest.clearAllMocks();
  });

  const validQuote = {
    name: "John Doe",
    email: "john@example.com",
    phone: "555-123-4567",
    address: "1234 Elm St, Sacramento, CA 95819",
    lead_type: "quote",
    service_type: "AC Repair",
    preferred_date: "2030-07-15",
    preferred_time_slot: "Morning (8 AM - 12 PM)",
  };

  test("returns 201 with all new fields populated", async () => {
    pool.execute.mockResolvedValueOnce([{ insertId: 1 }]);

    const res = await makeRequest(app, "POST", "/api/leads", validQuote);

    expect(res.status).toBe(201);
    expect(res.body.message).toBe("Lead created successfully");
    expect(res.body.lead_id).toBe(1);
  });

  test("returns 201 when optional fields are absent", async () => {
    pool.execute.mockResolvedValueOnce([{ insertId: 2 }]);

    const res = await makeRequest(app, "POST", "/api/leads", {
      name: "Jane Smith",
      email: "jane@example.com",
      phone: "555-987-6543",
      lead_type: "quote",
    });

    expect(res.status).toBe(201);
    expect(res.body.lead_id).toBe(2);
  });

  test("stores preferred_date in the database insert", async () => {
    pool.execute.mockResolvedValueOnce([{ insertId: 1 }]);

    await makeRequest(app, "POST", "/api/leads", validQuote);

    expect(pool.execute).toHaveBeenCalledTimes(1);
    const insertCall = pool.execute.mock.calls[0];
    const sql = insertCall[0];
    const params = insertCall[1];
    expect(sql).toContain("preferred_date");
    expect(params).toContain("2030-07-15");
  });

  test("stores preferred_time_slot in the database insert", async () => {
    pool.execute.mockResolvedValueOnce([{ insertId: 1 }]);

    await makeRequest(app, "POST", "/api/leads", validQuote);

    const params = pool.execute.mock.calls[0][1];
    expect(params).toContain("Morning (8 AM - 12 PM)");
  });

  test("stores address in the database insert", async () => {
    pool.execute.mockResolvedValueOnce([{ insertId: 1 }]);

    await makeRequest(app, "POST", "/api/leads", validQuote);

    const sql = pool.execute.mock.calls[0][0];
    const params = pool.execute.mock.calls[0][1];
    expect(sql).toContain("address");
    expect(params).toContain("1234 Elm St, Sacramento, CA 95819");
  });

  test("returns 400 when required fields are missing", async () => {
    const res = await makeRequest(app, "POST", "/api/leads", {
      lead_type: "quote",
    });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Validation failed");
    expect(res.body.details).toContain("email is required");
  });

  test("existing contact form submission still returns 201", async () => {
    pool.execute.mockResolvedValueOnce([{ insertId: 3 }]);

    const res = await makeRequest(app, "POST", "/api/leads", {
      name: "Contact User",
      email: "contact@example.com",
      phone: "555-111-2222",
      lead_type: "contact",
      message: "I have a question about your services.",
    });

    expect(res.status).toBe(201);
    expect(res.body.message).toBe("Lead created successfully");
    expect(res.body.lead_id).toBe(3);
  });
});
