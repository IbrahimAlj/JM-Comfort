const express = require("express");

jest.mock("../config/db", () => ({
  execute: jest.fn(),
}));

const pool = require("../config/db");
const analyticsRoutes = require("../routes/analytics");

function createApp() {
  const app = express();
  app.use(express.json());
  app.use("/api/admin/analytics", analyticsRoutes);
  return app;
}

function makeRequest(app, method, path, { headers } = {}) {
  return new Promise((resolve) => {
    const server = app.listen(0, () => {
      const port = server.address().port;
      const url = `http://localhost:${port}${path}`;
      const options = {
        method,
        headers: { "Content-Type": "application/json", ...headers },
      };

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

const ADMIN_KEY = "test-admin-key-123";

describe("GET /api/admin/analytics", () => {
  let app;

  beforeEach(() => {
    process.env.ADMIN_API_KEY = ADMIN_KEY;
    app = createApp();
    jest.clearAllMocks();
  });

  afterEach(() => {
    delete process.env.ADMIN_API_KEY;
  });

  describe("Authentication", () => {
    test("returns 403 when no admin key is provided", async () => {
      const res = await makeRequest(app, "GET", "/api/admin/analytics");
      expect(res.status).toBe(403);
      expect(res.body.error).toBe("forbidden");
    });

    test("returns 403 when admin key is wrong", async () => {
      const res = await makeRequest(app, "GET", "/api/admin/analytics", {
        headers: { "x-admin-key": "wrong-key" },
      });
      expect(res.status).toBe(403);
      expect(res.body.error).toBe("forbidden");
    });

    test("returns 403 when ADMIN_API_KEY env is not set", async () => {
      delete process.env.ADMIN_API_KEY;
      const res = await makeRequest(app, "GET", "/api/admin/analytics", {
        headers: { "x-admin-key": ADMIN_KEY },
      });
      expect(res.status).toBe(403);
      expect(res.body.error).toBe("admin access not configured");
    });

    test("accepts x-admin-key header", async () => {
      mockSuccessfulQueries();
      const res = await makeRequest(app, "GET", "/api/admin/analytics", {
        headers: { "x-admin-key": ADMIN_KEY },
      });
      expect(res.status).toBe(200);
    });

    test("accepts Authorization Bearer token", async () => {
      mockSuccessfulQueries();
      const res = await makeRequest(app, "GET", "/api/admin/analytics", {
        headers: { Authorization: `Bearer ${ADMIN_KEY}` },
      });
      expect(res.status).toBe(200);
    });
  });

  describe("Success response", () => {
    test("returns aggregated analytics", async () => {
      mockSuccessfulQueries();
      const res = await makeRequest(app, "GET", "/api/admin/analytics", {
        headers: { "x-admin-key": ADMIN_KEY },
      });

      expect(res.status).toBe(200);
      expect(res.body.ok).toBe(true);

      const a = res.body.analytics;
      expect(a.total_customers).toBe(25);
      expect(a.total_bookings).toBe(40);
      expect(a.bookings_by_status).toEqual({
        scheduled: 15,
        completed: 20,
        cancelled: 5,
      });
      expect(a.total_leads).toBe(30);
      expect(a.leads_by_status).toEqual({ new: 10, reviewed: 15, closed: 5 });
      expect(a.total_projects).toBe(12);
      expect(a.projects_by_status).toEqual({
        planned: 3,
        in_progress: 5,
        completed: 4,
      });
      expect(a.total_reviews).toBe(18);
      expect(a.average_rating).toBe(4.25);
      expect(a.total_active_services).toBe(6);
    });

    test("handles zero data gracefully", async () => {
      pool.execute
        .mockResolvedValueOnce([[{ total_customers: 0 }]])
        .mockResolvedValueOnce([[{ total_bookings: 0 }]])
        .mockResolvedValueOnce([[]])
        .mockResolvedValueOnce([[{ total_leads: 0 }]])
        .mockResolvedValueOnce([[]])
        .mockResolvedValueOnce([[{ total_projects: 0 }]])
        .mockResolvedValueOnce([[]])
        .mockResolvedValueOnce([[{ total_reviews: 0, average_rating: 0 }]])
        .mockResolvedValueOnce([[{ total_active_services: 0 }]]);

      const res = await makeRequest(app, "GET", "/api/admin/analytics", {
        headers: { "x-admin-key": ADMIN_KEY },
      });

      expect(res.status).toBe(200);
      const a = res.body.analytics;
      expect(a.total_customers).toBe(0);
      expect(a.total_bookings).toBe(0);
      expect(a.bookings_by_status).toEqual({});
      expect(a.total_leads).toBe(0);
      expect(a.average_rating).toBe(0);
    });
  });

  describe("Database errors", () => {
    test("returns 500 when database query fails", async () => {
      pool.execute.mockRejectedValueOnce(new Error("Connection lost"));

      const res = await makeRequest(app, "GET", "/api/admin/analytics", {
        headers: { "x-admin-key": ADMIN_KEY },
      });
      expect(res.status).toBe(500);
      expect(res.body.error).toBe("Internal server error");
    });
  });
});

function mockSuccessfulQueries() {
  pool.execute
    .mockResolvedValueOnce([[{ total_customers: 25 }]])
    .mockResolvedValueOnce([[{ total_bookings: 40 }]])
    .mockResolvedValueOnce([
      [
        { status: "scheduled", count: 15 },
        { status: "completed", count: 20 },
        { status: "cancelled", count: 5 },
      ],
    ])
    .mockResolvedValueOnce([[{ total_leads: 30 }]])
    .mockResolvedValueOnce([
      [
        { status: "new", count: 10 },
        { status: "reviewed", count: 15 },
        { status: "closed", count: 5 },
      ],
    ])
    .mockResolvedValueOnce([[{ total_projects: 12 }]])
    .mockResolvedValueOnce([
      [
        { status: "planned", count: 3 },
        { status: "in_progress", count: 5 },
        { status: "completed", count: 4 },
      ],
    ])
    .mockResolvedValueOnce([[{ total_reviews: 18, average_rating: 4.25 }]])
    .mockResolvedValueOnce([[{ total_active_services: 6 }]]);
}
